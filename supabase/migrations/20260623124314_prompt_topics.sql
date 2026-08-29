-- Admin-managed navigation topics for the free prompt library ("מפת נושאים").
create table if not exists public.prompt_topics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon text,                 -- optional emoji shown on the map tile
  color text,                -- optional accent (css color); falls back to a palette
  display_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.prompt_topics enable row level security;

drop policy if exists "public read prompt topics" on public.prompt_topics;
create policy "public read prompt topics" on public.prompt_topics for select using (true);

drop policy if exists "admin all prompt topics" on public.prompt_topics;
create policy "admin all prompt topics" on public.prompt_topics
  for all to authenticated
  using (has_role(auth.uid(), 'admin'::app_role))
  with check (has_role(auth.uid(), 'admin'::app_role));

-- Each prompt may belong to one topic.
alter table public.prompts
  add column if not exists topic_id uuid references public.prompt_topics(id) on delete set null;
create index if not exists prompts_topic_idx on public.prompts(topic_id);;
