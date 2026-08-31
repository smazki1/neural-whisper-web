create table if not exists public.icount_webhook_log (
  id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  raw jsonb,
  result text,
  constraint icount_webhook_log_pkey primary key (id)
);

alter table public.icount_webhook_log
  add column if not exists id uuid not null default gen_random_uuid(),
  add column if not exists created_at timestamp with time zone default now(),
  add column if not exists raw jsonb,
  add column if not exists result text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.icount_webhook_log'::regclass
      and conname = 'icount_webhook_log_pkey'
  ) then
    alter table public.icount_webhook_log
      add constraint icount_webhook_log_pkey primary key (id);
  end if;
end
$$;

do $$
begin
  if not (
    select relrowsecurity
    from pg_class
    where oid = 'public.icount_webhook_log'::regclass
  ) then
    alter table public.icount_webhook_log enable row level security;
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'icount_webhook_log'
      and policyname = 'admin read webhook log'
  ) then
    create policy "admin read webhook log"
      on public.icount_webhook_log
      as permissive
      for select
      to public
      using (public.has_role(auth.uid(), 'admin'::public.app_role));
  end if;
end
$$;

do $$
begin
  if exists (
    select 1
    from (
      values ('anon'), ('authenticated'), ('service_role')
    ) as roles(role_name)
    cross join (
      values
        ('DELETE'),
        ('INSERT'),
        ('REFERENCES'),
        ('SELECT'),
        ('TRIGGER'),
        ('TRUNCATE'),
        ('UPDATE')
    ) as privileges(privilege_name)
    where not has_table_privilege(
      roles.role_name,
      'public.icount_webhook_log',
      privileges.privilege_name
    )
  ) then
    execute 'grant all privileges on table public.icount_webhook_log to anon, authenticated, service_role';
  end if;
end
$$;

create table if not exists public.enrollments (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  course_id uuid not null,
  status text default 'pending'::text,
  icount_doc_number text,
  amount_paid numeric,
  enrolled_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  icount_confirmation_code text,
  icount_doc_url text,
  constraint enrollments_pkey primary key (id),
  constraint enrollments_user_id_course_id_key unique (user_id, course_id),
  constraint enrollments_user_id_fkey foreign key (user_id) references auth.users(id),
  constraint enrollments_course_id_fkey foreign key (course_id) references public.courses(id),
  constraint enrollments_status_check check (
    status = any (array[
      'pending'::text,
      'paid'::text,
      'refunded'::text,
      'failed'::text
    ])
  )
);

alter table public.enrollments
  add column if not exists id uuid not null default gen_random_uuid(),
  add column if not exists user_id uuid not null,
  add column if not exists course_id uuid not null,
  add column if not exists status text default 'pending'::text,
  add column if not exists icount_doc_number text,
  add column if not exists amount_paid numeric,
  add column if not exists enrolled_at timestamp with time zone,
  add column if not exists created_at timestamp with time zone default now(),
  add column if not exists icount_confirmation_code text,
  add column if not exists icount_doc_url text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.enrollments'::regclass
      and conname = 'enrollments_pkey'
  ) then
    alter table public.enrollments
      add constraint enrollments_pkey primary key (id);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.enrollments'::regclass
      and conname = 'enrollments_user_id_course_id_key'
  ) then
    alter table public.enrollments
      add constraint enrollments_user_id_course_id_key unique (user_id, course_id);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.enrollments'::regclass
      and conname = 'enrollments_user_id_fkey'
  ) then
    alter table public.enrollments
      add constraint enrollments_user_id_fkey
      foreign key (user_id) references auth.users(id);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.enrollments'::regclass
      and conname = 'enrollments_course_id_fkey'
  ) then
    alter table public.enrollments
      add constraint enrollments_course_id_fkey
      foreign key (course_id) references public.courses(id);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.enrollments'::regclass
      and conname = 'enrollments_status_check'
  ) then
    alter table public.enrollments
      add constraint enrollments_status_check check (
        status = any (array[
          'pending'::text,
          'paid'::text,
          'refunded'::text,
          'failed'::text
        ])
      );
  end if;
end
$$;

do $$
begin
  if not (
    select relrowsecurity
    from pg_class
    where oid = 'public.enrollments'::regclass
  ) then
    alter table public.enrollments enable row level security;
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'enrollments'
      and policyname = 'users insert own enrollments'
  ) then
    create policy "users insert own enrollments"
      on public.enrollments
      as permissive
      for insert
      to public
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'enrollments'
      and policyname = 'users see own enrollments'
  ) then
    create policy "users see own enrollments"
      on public.enrollments
      as permissive
      for select
      to public
      using (auth.uid() = user_id);
  end if;
end
$$;

do $$
begin
  if exists (
    select 1
    from (
      values ('anon'), ('authenticated'), ('service_role')
    ) as roles(role_name)
    cross join (
      values
        ('DELETE'),
        ('INSERT'),
        ('REFERENCES'),
        ('SELECT'),
        ('TRIGGER'),
        ('TRUNCATE'),
        ('UPDATE')
    ) as privileges(privilege_name)
    where not has_table_privilege(
      roles.role_name,
      'public.enrollments',
      privileges.privilege_name
    )
  ) then
    execute 'grant all privileges on table public.enrollments to anon, authenticated, service_role';
  end if;
end
$$;

alter table public.courses
  add column if not exists icount_page_url text;
