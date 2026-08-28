create table public.vibe_apps (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  url text,
  thumbnail_url text,
  emoji text,
  published boolean default false,
  display_order integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.vibe_apps enable row level security;

create policy "admin all vibe_apps" on public.vibe_apps
  as permissive for all to authenticated
  using (has_role(auth.uid(), 'admin'::app_role))
  with check (has_role(auth.uid(), 'admin'::app_role));

create policy "public read vibe_apps" on public.vibe_apps
  as permissive for select to public
  using (published = true);;
