alter table public.prompts add column if not exists featured boolean not null default false;
create index if not exists prompts_featured_order_idx on public.prompts (featured desc, display_order asc);;
