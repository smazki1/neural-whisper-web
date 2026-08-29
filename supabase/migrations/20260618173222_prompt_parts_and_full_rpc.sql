-- Multi-part prompts: structured, independently-copyable sections.
alter table public.prompts add column if not exists parts jsonb not null default '[]'::jsonb;

-- Gated fetch returning BOTH content and parts, with the SAME access rules as prompt_content.
create or replace function public.prompt_full(p_id uuid)
returns jsonb
language sql
security definer
set search_path to 'public'
as $function$
  select case
    when p.published is not true then null
    when p.product_id is null or p.is_sample
      then jsonb_build_object('content', p.content, 'parts', coalesce(p.parts, '[]'::jsonb))
    when auth.uid() is not null and exists (
      select 1 from entitlements e
      where e.user_id = auth.uid()
        and e.product_id = p.product_id
        and e.status = 'paid'
    )
      then jsonb_build_object('content', p.content, 'parts', coalesce(p.parts, '[]'::jsonb))
    else null
  end
  from prompts p
  where p.id = p_id;
$function$;

grant execute on function public.prompt_full(uuid) to anon, authenticated;;
