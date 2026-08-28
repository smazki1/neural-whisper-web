-- Reconcile commerce-to-course access objects that predate the tracked
-- migration history. This migration is safe on the existing Production
-- schema and also supports a clean database build.

alter table public.products
  add column if not exists course_id uuid;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.products'::regclass
      and conname = 'products_course_id_fkey'
  ) then
    alter table public.products
      add constraint products_course_id_fkey
      foreign key (course_id)
      references public.courses(id)
      on delete set null;
  end if;
end
$$;

create index if not exists products_course_id_idx
  on public.products(course_id);

create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null
    references auth.users(id) on delete cascade,
  product_id uuid not null
    references public.products(id) on delete cascade,
  status text not null default 'pending'
    constraint entitlements_status_check
    check (status in ('pending', 'paid', 'refunded', 'failed')),
  amount_paid numeric,
  icount_doc_number text,
  icount_confirmation_code text,
  icount_doc_url text,
  created_at timestamptz not null default now(),
  granted_at timestamptz
);

create unique index if not exists entitlements_user_product_idx
  on public.entitlements(user_id, product_id);

alter table public.entitlements enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'entitlements'
      and policyname = 'user reads own entitlements'
  ) then
    create policy "user reads own entitlements"
      on public.entitlements
      for select
      to authenticated
      using ((select auth.uid()) = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'entitlements'
      and policyname = 'user inserts own pending entitlement'
  ) then
    create policy "user inserts own pending entitlement"
      on public.entitlements
      for insert
      to authenticated
      with check (
        (select auth.uid()) = user_id
        and status = 'pending'
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'entitlements'
      and policyname = 'admin all entitlements'
  ) then
    create policy "admin all entitlements"
      on public.entitlements
      for all
      to authenticated
      using (public.has_role((select auth.uid()), 'admin'::public.app_role))
      with check (public.has_role((select auth.uid()), 'admin'::public.app_role));
  end if;
end
$$;

grant select, insert on table public.entitlements to authenticated;
grant all on table public.entitlements to service_role;
