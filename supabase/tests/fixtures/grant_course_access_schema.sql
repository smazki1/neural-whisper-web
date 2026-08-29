-- Focused schema fixture for a newly created disposable local database only.
create schema if not exists extensions;
create extension if not exists pgtap with schema extensions;
create extension if not exists pgcrypto with schema extensions;
set search_path = public, extensions;

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    create role anon nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin;
  end if;
end
$$;

create schema auth;

create type public.app_role as enum ('admin', 'instructor', 'student');
create type public.order_status as enum ('pending', 'completed', 'failed', 'refunded');

create table auth.users (
  id uuid primary key
);

create function auth.uid()
returns uuid
language sql
stable
as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
$$;

create table public.user_roles (
  user_id uuid not null references auth.users(id),
  role public.app_role not null,
  primary key (user_id, role)
);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

create table public.courses (
  id uuid primary key,
  user_id uuid not null references auth.users(id),
  title text not null,
  category text not null,
  level text not null,
  published boolean not null default false,
  is_free boolean not null default false
);

create table public.products (
  id uuid primary key,
  title text not null,
  slug text not null unique,
  category text not null,
  is_published boolean not null default false,
  course_id uuid references public.courses(id)
);

create table public.products_courses (
  product_id uuid not null references public.products(id),
  course_id uuid not null references public.courses(id),
  primary key (product_id, course_id)
);

create table public.orders (
  id uuid primary key,
  user_id uuid references auth.users(id),
  product_id uuid not null references public.products(id),
  total_amount numeric not null,
  status public.order_status not null default 'pending'
);

create table public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  product_id uuid not null references public.products(id),
  status text not null check (status in ('pending', 'paid', 'refunded', 'failed')),
  unique (user_id, product_id)
);

create table public.user_course_access (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  course_id uuid not null references public.courses(id),
  product_id uuid references public.products(id),
  order_id uuid references public.orders(id),
  granted_at timestamptz not null default now(),
  unique (user_id, course_id)
);

alter table public.orders enable row level security;
alter table public.entitlements enable row level security;
alter table public.user_course_access enable row level security;
alter table public.courses enable row level security;

create policy "Users can view their own orders"
on public.orders for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own orders"
on public.orders for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "user reads own entitlements"
on public.entitlements for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can view their own course access"
on public.user_course_access for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Enrolled users can view courses"
on public.courses for select to authenticated
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

create policy "Users can insert own course access via paid order"
on public.user_course_access for insert to authenticated
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.orders o
    where o.id = user_course_access.order_id
      and o.user_id = auth.uid()
      and o.status = 'completed'::public.order_status
  )
);

create policy "Admins can insert course access"
on public.user_course_access for insert to authenticated
with check (public.has_role(auth.uid(), 'admin'::public.app_role));

grant usage on schema public, auth, extensions to anon, authenticated;
grant execute on function auth.uid() to anon, authenticated;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;
grant select on public.orders, public.products, public.products_courses,
  public.entitlements, public.user_course_access, public.courses to authenticated;
grant insert on public.orders to authenticated;
grant insert on public.user_course_access to anon, authenticated;
