alter table public.prompts add column if not exists how_to_use text;

create or replace function public.prompt_full(p_id uuid)
returns jsonb
language sql
security definer
set search_path to 'public'
as $function$
  select case
    when p.published is not true then null
    when p.product_id is null or p.is_sample
      then jsonb_build_object('content', p.content, 'parts', coalesce(p.parts, '[]'::jsonb), 'description', p.description, 'how_to_use', p.how_to_use)
    when auth.uid() is not null and exists (
      select 1 from entitlements e
      where e.user_id = auth.uid() and e.product_id = p.product_id and e.status = 'paid'
    )
      then jsonb_build_object('content', p.content, 'parts', coalesce(p.parts, '[]'::jsonb), 'description', p.description, 'how_to_use', p.how_to_use)
    else null
  end
  from prompts p
  where p.id = p_id;
$function$;;
