-- Fix Security Definer View issues by recreating views without SECURITY DEFINER
DROP VIEW IF EXISTS public.published_posts;
DROP VIEW IF EXISTS public.published_products;

-- Recreate views as regular views (not SECURITY DEFINER)
CREATE VIEW public.published_posts AS
SELECT 
  id, title, slug, content, excerpt, featured_image_url,
  category_id, is_published, published_at, created_at,
  meta_title, meta_description, tags
FROM public.blog_posts 
WHERE is_published = true AND published_at <= now();

CREATE VIEW public.published_products AS
SELECT 
  id, title, slug, description, short_description, price,
  thumbnail_url, category, product_type, is_featured,
  created_at, meta_title, meta_description
FROM public.products 
WHERE is_published = true;

-- Grant proper access to views
GRANT SELECT ON public.published_posts TO anon, authenticated;
GRANT SELECT ON public.published_products TO anon, authenticated;

-- Fix function search path for existing functions
ALTER FUNCTION public.has_role(uuid, app_role) SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;;
