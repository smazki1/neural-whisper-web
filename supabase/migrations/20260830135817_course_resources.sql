alter type public.resource_type add value if not exists 'file';

alter table public.resources
  alter column url drop not null,
  add column if not exists storage_path text,
  add column if not exists position integer not null default 0,
  add column if not exists file_name text,
  add column if not exists mime_type text,
  add column if not exists size_bytes bigint;

alter table public.resources
  drop constraint if exists resources_size_bytes_check,
  add constraint resources_size_bytes_check
    check (size_bytes is null or size_bytes >= 0),
  drop constraint if exists resources_source_check,
  add constraint resources_source_check check (
    (
      type::text = 'file'
      and storage_path is not null
      and btrim(storage_path) <> ''
      and url is null
    )
    or
    (
      type::text <> 'file'
      and url is not null
      and btrim(url) <> ''
      and storage_path is null
    )
  );

create index if not exists resources_lesson_position_idx
  on public.resources (lesson_id, position, created_at);

create unique index if not exists resources_storage_path_unique_idx
  on public.resources (storage_path)
  where storage_path is not null;

alter table public.lessons
  add column if not exists is_upcoming boolean not null default false;

drop function if exists public.course_curriculum(uuid);

create function public.course_curriculum(p_course_id uuid)
returns table(
  module_id uuid,
  module_title text,
  module_description text,
  module_position integer,
  lesson_id uuid,
  lesson_title text,
  lesson_position integer,
  duration text,
  duration_minutes integer,
  is_preview boolean,
  is_upcoming boolean
)
language sql
stable
security definer
set search_path = public
as $$
  select
    m.id,
    m.title,
    m.description,
    m.position,
    l.id,
    l.title,
    l.position,
    l.duration,
    l.duration_minutes,
    coalesce(l.is_preview, false),
    coalesce(l.is_upcoming, false)
  from public.courses c
  join public.modules m on m.course_id = c.id
  left join public.lessons l on l.module_id = m.id
  where c.id = p_course_id
    and (
      c.published = true
      or c.user_id = (select auth.uid())
      or public.has_role((select auth.uid()), 'admin'::public.app_role)
    )
  order by m.position, l.position;
$$;

revoke all on function public.course_curriculum(uuid) from public;
grant execute on function public.course_curriculum(uuid) to anon, authenticated;

-- Bucket configuration is tracked in SQL. File operations still go through
-- the Storage API, with storage.objects treated as metadata only.
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'course-resources',
  'course-resources',
  false,
  26214400,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.oasis.opendocument.text',
    'application/vnd.oasis.opendocument.spreadsheet',
    'application/vnd.oasis.opendocument.presentation',
    'application/rtf',
    'application/zip',
    'application/x-zip-compressed',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'text/plain',
    'text/csv',
    'application/json'
  ]::text[]
)
on conflict (id) do update
set
  name = excluded.name,
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view resources of published courses"
  on public.resources;
drop policy if exists "Public can view resources of free or preview lessons"
  on public.resources;
drop policy if exists "Enrolled users can view resources"
  on public.resources;
drop policy if exists "Owners can modify resources"
  on public.resources;
drop policy if exists "Exact course access can view resources"
  on public.resources;
drop policy if exists "Admins can manage resources"
  on public.resources;

create policy "Exact course access can view resources"
on public.resources
for select
to authenticated
using (
  public.has_role((select auth.uid()), 'admin'::public.app_role)
  or exists (
    select 1
    from public.lessons l
    join public.modules m on m.id = l.module_id
    where l.id = resources.lesson_id
      and (
        exists (
          select 1
          from public.user_course_access uca
          where uca.user_id = (select auth.uid())
            and uca.course_id = m.course_id
        )
        or exists (
          select 1
          from public.entitlements e
          join public.products p on p.id = e.product_id
          where e.user_id = (select auth.uid())
            and e.status = 'paid'
            and p.course_id = m.course_id
        )
      )
  )
);

create policy "Admins can manage resources"
on public.resources
for all
to authenticated
using (public.has_role((select auth.uid()), 'admin'::public.app_role))
with check (public.has_role((select auth.uid()), 'admin'::public.app_role));

drop policy if exists "Admins can manage course resources"
  on storage.objects;
drop policy if exists "Exact course access can read course resources"
  on storage.objects;

create policy "Admins can manage course resources"
on storage.objects
for all
to authenticated
using (
  bucket_id = 'course-resources'
  and public.has_role((select auth.uid()), 'admin'::public.app_role)
)
with check (
  bucket_id = 'course-resources'
  and public.has_role((select auth.uid()), 'admin'::public.app_role)
);

create policy "Exact course access can read course resources"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'course-resources'
  and exists (
    select 1
    from public.resources
    join public.lessons l on l.id = resources.lesson_id
    join public.modules m on m.id = l.module_id
    where resources.storage_path = storage.objects.name
      and (
        exists (
          select 1
          from public.user_course_access uca
          where uca.user_id = (select auth.uid())
            and uca.course_id = m.course_id
        )
        or exists (
          select 1
          from public.entitlements e
          join public.products p on p.id = e.product_id
          where e.user_id = (select auth.uid())
            and e.status = 'paid'
            and p.course_id = m.course_id
        )
      )
  )
);

create or replace function public.reorder_lesson_resources(
  p_lesson_id uuid,
  p_resource_ids uuid[]
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  expected_count integer;
  supplied_count integer;
  supplied_distinct_count integer;
begin
  if not public.has_role((select auth.uid()), 'admin'::public.app_role) then
    raise exception 'administrator access required' using errcode = '42501';
  end if;

  select count(*)
  into expected_count
  from public.resources
  where lesson_id = p_lesson_id;

  select count(*), count(distinct id)
  into supplied_count, supplied_distinct_count
  from unnest(p_resource_ids) as ids(id);

  if supplied_count <> expected_count
    or supplied_distinct_count <> supplied_count
    or exists (
      select 1
      from unnest(p_resource_ids) as ids(id)
      where not exists (
        select 1
        from public.resources r
        where r.id = ids.id
          and r.lesson_id = p_lesson_id
      )
    )
  then
    raise exception 'resource order must contain every lesson resource exactly once'
      using errcode = '22023';
  end if;

  update public.resources r
  set position = ordered.ordinality - 1
  from unnest(p_resource_ids) with ordinality as ordered(id, ordinality)
  where r.id = ordered.id
    and r.lesson_id = p_lesson_id;
end;
$$;

revoke all on function public.reorder_lesson_resources(uuid, uuid[]) from public;
grant execute on function public.reorder_lesson_resources(uuid, uuid[])
  to authenticated;
