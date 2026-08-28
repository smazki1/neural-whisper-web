alter table public.lessons
  add column if not exists extra_videos jsonb not null default '[]'::jsonb;;
