-- 1) Pack sections (the "journey" stages)
create table if not exists public.prompt_pack_sections (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  title text not null,
  description text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists prompt_pack_sections_product_idx on public.prompt_pack_sections(product_id);
alter table public.prompt_pack_sections enable row level security;

drop policy if exists "admin all pack sections" on public.prompt_pack_sections;
create policy "admin all pack sections" on public.prompt_pack_sections
  for all to authenticated
  using (has_role(auth.uid(), 'admin'::app_role))
  with check (has_role(auth.uid(), 'admin'::app_role));

drop policy if exists "public read sections of published packs" on public.prompt_pack_sections;
create policy "public read sections of published packs" on public.prompt_pack_sections
  for select using (
    exists (select 1 from public.products pr where pr.id = product_id and pr.is_published = true)
  );

-- 2) Prompt -> section assignment + ordering, with a guard that the section
--    belongs to the same pack as the prompt.
alter table public.prompts
  add column if not exists pack_section_id uuid references public.prompt_pack_sections(id) on delete set null,
  add column if not exists pack_display_order int not null default 0;
create index if not exists prompts_pack_section_idx on public.prompts(pack_section_id);

create or replace function public.prompts_validate_pack_section()
returns trigger language plpgsql as $$
begin
  if new.pack_section_id is not null then
    if new.product_id is null then
      raise exception 'pack_section_id requires a product_id';
    end if;
    if not exists (
      select 1 from public.prompt_pack_sections s
      where s.id = new.pack_section_id and s.product_id = new.product_id
    ) then
      raise exception 'pack_section_id % does not belong to product %', new.pack_section_id, new.product_id;
    end if;
  end if;
  return new;
end;
$$;
drop trigger if exists prompts_validate_pack_section_trg on public.prompts;
create trigger prompts_validate_pack_section_trg
  before insert or update on public.prompts
  for each row execute function public.prompts_validate_pack_section();

-- 3) RLS leak fix: direct reads only for free / sample / owned rows.
--    Locked pack prompts become invisible to non-owners (no content leak).
drop policy if exists "public read prompts" on public.prompts;
create policy "read free sample or owned prompts" on public.prompts
  for select using (
    published = true and (
      product_id is null
      or is_sample = true
      or (auth.uid() is not null and exists (
        select 1 from public.entitlements e
        where e.user_id = auth.uid()
          and e.product_id = prompts.product_id
          and e.status = 'paid'
      ))
    )
  );

-- 4) Safe pack listing RPC — metadata + locked flag only, never content/parts.
create or replace function public.pack_prompts(p_pack_id uuid)
returns table (
  id uuid, title text, description text, is_sample boolean,
  pack_section_id uuid, pack_display_order int, display_order int,
  guide_id uuid, tags text[], locked boolean
)
language sql security definer set search_path to 'public' as $$
  select p.id, p.title, p.description, p.is_sample,
    p.pack_section_id, p.pack_display_order, p.display_order, p.guide_id, p.tags,
    not (
      p.product_id is null or p.is_sample
      or (auth.uid() is not null and exists (
        select 1 from entitlements e
        where e.user_id = auth.uid() and e.product_id = p.product_id and e.status = 'paid'
      ))
    ) as locked
  from prompts p
  where p.product_id = p_pack_id
    and (p.published = true or has_role(auth.uid(), 'admin'::app_role))
  order by p.pack_display_order, p.display_order, p.created_at;
$$;
grant execute on function public.pack_prompts(uuid) to anon, authenticated;;
