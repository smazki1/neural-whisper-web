-- Enums
do $$ begin
  create type public.course_category as enum ('strategy','marketing','tech');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.course_level as enum ('beginner','intermediate','advanced');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.resource_type as enum ('video','pdf','slides','link');
exception when duplicate_object then null;
end $$;

-- Tables
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  category public.course_category not null,
  level public.course_level not null,
  duration text,
  description text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  title text not null,
  duration text,
  content text,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  type public.resource_type not null,
  label text,
  url text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger function for updated_at
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers
create trigger trg_courses_updated_at
before update on public.courses
for each row execute function public.update_updated_at_column();

create trigger trg_modules_updated_at
before update on public.modules
for each row execute function public.update_updated_at_column();

create trigger trg_lessons_updated_at
before update on public.lessons
for each row execute function public.update_updated_at_column();

create trigger trg_resources_updated_at
before update on public.resources
for each row execute function public.update_updated_at_column();

-- RLS
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.resources enable row level security;

-- Policies for courses
create policy "Public can view published courses"
  on public.courses for select
  using (published = true);

create policy "Users can view their own courses"
  on public.courses for select to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own courses"
  on public.courses for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own courses"
  on public.courses for update to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete their own courses"
  on public.courses for delete to authenticated
  using (auth.uid() = user_id);

-- Policies for modules
create policy "Public can view modules of published courses"
  on public.modules for select
  using (exists (
    select 1 from public.courses c
    where c.id = modules.course_id and (c.published = true or c.user_id = auth.uid())
  ));

create policy "Owners can modify modules"
  on public.modules for all to authenticated
  using (exists (
    select 1 from public.courses c
    where c.id = modules.course_id and c.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.courses c
    where c.id = modules.course_id and c.user_id = auth.uid()
  ));

-- Policies for lessons
create policy "Public can view lessons of published courses"
  on public.lessons for select
  using (exists (
    select 1 from public.courses c
    join public.modules m on m.course_id = c.id
    where m.id = lessons.module_id and (c.published = true or c.user_id = auth.uid())
  ));

create policy "Owners can modify lessons"
  on public.lessons for all to authenticated
  using (exists (
    select 1 from public.courses c
    join public.modules m on m.course_id = c.id
    where m.id = lessons.module_id and c.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.courses c
    join public.modules m on m.course_id = c.id
    where m.id = lessons.module_id and c.user_id = auth.uid()
  ));

-- Policies for resources
create policy "Public can view resources of published courses"
  on public.resources for select
  using (exists (
    select 1 from public.courses c
    join public.modules m on m.course_id = c.id
    join public.lessons l on l.module_id = m.id
    where l.id = resources.lesson_id and (c.published = true or c.user_id = auth.uid())
  ));

create policy "Owners can modify resources"
  on public.resources for all to authenticated
  using (exists (
    select 1 from public.courses c
    join public.modules m on m.course_id = c.id
    join public.lessons l on l.module_id = m.id
    where l.id = resources.lesson_id and c.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.courses c
    join public.modules m on m.course_id = c.id
    join public.lessons l on l.module_id = m.id
    where l.id = resources.lesson_id and c.user_id = auth.uid()
  ));
