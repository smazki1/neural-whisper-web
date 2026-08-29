-- Published prompt packs + counts for the /prompts library page.
-- p_preview=true also returns unpublished packs, but only for admins.
create or replace function public.prompt_packs(p_preview boolean default false)
returns table (
  id uuid, title text, slug text, short_description text, description text,
  thumbnail_url text, price numeric, discount_price numeric, is_free boolean,
  icount_page_url text, is_published boolean, display_order int,
  prompt_count bigint, section_count bigint
)
language sql security definer set search_path to 'public' as $$
  select pr.id, pr.title, pr.slug, pr.short_description, pr.description,
    pr.thumbnail_url, pr.price, pr.discount_price, pr.is_free,
    pr.icount_page_url, pr.is_published, pr.display_order,
    (select count(*) from prompts p where p.product_id = pr.id and p.published) as prompt_count,
    (select count(*) from prompt_pack_sections s where s.product_id = pr.id) as section_count
  from products pr
  where pr.product_type = 'prompt_pack'
    and (pr.is_published = true or (p_preview and has_role(auth.uid(), 'admin'::app_role)))
  order by pr.display_order, pr.created_at;
$$;
grant execute on function public.prompt_packs(boolean) to anon, authenticated;;
