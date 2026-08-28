-- Paid entitlements remain valid even after a product is unpublished. This
-- SELECT-only policy lets the owner of a paid entitlement resolve exactly the
-- purchased product without broadening access to other products.
drop policy if exists "Entitled users can view purchased products" on public.products;
create policy "Entitled users can view purchased products"
on public.products
for select
to authenticated
using (
  exists (
    select 1
    from public.entitlements e
    where e.product_id = products.id
      and e.user_id = (select auth.uid())
      and e.status = 'paid'
  )
);

drop policy if exists "Enrolled users can view courses" on public.courses;
drop policy if exists "Enrolled users can view modules" on public.modules;
drop policy if exists "Enrolled users can view lessons" on public.lessons;
drop policy if exists "Enrolled users can view resources" on public.resources;

create policy "Enrolled users can view courses"
on public.courses
for select
to authenticated
using (
  exists (
    select 1
    from public.user_course_access uca
    where uca.course_id = courses.id
      and uca.user_id = (select auth.uid())
  )
  or exists (
    select 1
    from public.entitlements e
    join public.products p on p.id = e.product_id
    where e.user_id = (select auth.uid())
      and e.status = 'paid'
      and p.course_id = courses.id
  )
);

create policy "Enrolled users can view modules"
on public.modules
for select
to authenticated
using (
  exists (
    select 1
    from public.user_course_access uca
    where uca.course_id = modules.course_id
      and uca.user_id = (select auth.uid())
  )
  or exists (
    select 1
    from public.entitlements e
    join public.products p on p.id = e.product_id
    where e.user_id = (select auth.uid())
      and e.status = 'paid'
      and p.course_id = modules.course_id
  )
);

create policy "Enrolled users can view lessons"
on public.lessons
for select
to authenticated
using (
  exists (
    select 1
    from public.modules m
    where m.id = lessons.module_id
      and (
        exists (
          select 1
          from public.user_course_access uca
          where uca.course_id = m.course_id
            and uca.user_id = (select auth.uid())
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

create policy "Enrolled users can view resources"
on public.resources
for select
to authenticated
using (
  exists (
    select 1
    from public.lessons l
    join public.modules m on m.id = l.module_id
    where l.id = resources.lesson_id
      and (
        exists (
          select 1
          from public.user_course_access uca
          where uca.course_id = m.course_id
            and uca.user_id = (select auth.uid())
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

-- A preview lesson needs its parent module metadata. Modules contain
-- curriculum metadata, not the protected lesson body, so published courses
-- expose module rows while lesson and resource rows remain independently
-- gated below. The dependency graph is modules -> courses and
-- lessons/resources -> modules -> courses, with no RLS cycle.
drop policy if exists "Public can view modules of free courses" on public.modules;
drop policy if exists "Public can view modules of published courses" on public.modules;
create policy "Public can view modules of published courses"
on public.modules
for select
to public
using (
  exists (
    select 1
    from public.courses c
    where c.id = modules.course_id
      and (
        c.user_id = (select auth.uid())
        or c.published = true
      )
  )
);

drop policy if exists "Public can view free or preview lessons" on public.lessons;
create policy "Public can view free or preview lessons"
on public.lessons
for select
to public
using (
  exists (
    select 1
    from public.modules m
    join public.courses c on c.id = m.course_id
    where m.id = lessons.module_id
      and (
        c.user_id = (select auth.uid())
        or (
          c.published = true
          and (c.is_free = true or lessons.is_preview = true)
        )
      )
  )
);

drop policy if exists "Public can view resources of free or preview lessons" on public.resources;
create policy "Public can view resources of free or preview lessons"
on public.resources
for select
to public
using (
  exists (
    select 1
    from public.lessons l
    join public.modules m on m.id = l.module_id
    join public.courses c on c.id = m.course_id
    where l.id = resources.lesson_id
      and (
        c.user_id = (select auth.uid())
        or (
          c.published = true
          and (c.is_free = true or l.is_preview = true)
        )
      )
  )
);

-- Admin SELECT is kept separate from public preview policies so anon never
-- evaluates has_role(), whose EXECUTE permission is intentionally restricted.
drop policy if exists "Admins can view all courses" on public.courses;
create policy "Admins can view all courses"
on public.courses
for select
to authenticated
using (public.has_role((select auth.uid()), 'admin'::public.app_role));

drop policy if exists "Admins can view all modules" on public.modules;
create policy "Admins can view all modules"
on public.modules
for select
to authenticated
using (public.has_role((select auth.uid()), 'admin'::public.app_role));

drop policy if exists "Admins can view all lessons" on public.lessons;
create policy "Admins can view all lessons"
on public.lessons
for select
to authenticated
using (public.has_role((select auth.uid()), 'admin'::public.app_role));

drop policy if exists "Admins can view all resources" on public.resources;
create policy "Admins can view all resources"
on public.resources
for select
to authenticated
using (public.has_role((select auth.uid()), 'admin'::public.app_role));
