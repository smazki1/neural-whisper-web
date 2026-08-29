
create table user_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type text not null check (item_type in ('guide', 'prompt', 'tool')),
  item_id uuid not null,
  created_at timestamptz default now(),
  unique(user_id, item_type, item_id)
);

alter table user_favorites enable row level security;

create policy "Users manage own favorites"
  on user_favorites for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
;
