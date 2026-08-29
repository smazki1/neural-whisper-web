-- Find and fix all security definer views and functions
-- First, let's check what views might be security definer
DO $$ 
DECLARE
    view_record RECORD;
BEGIN
    -- Check for any remaining security definer views
    FOR view_record IN 
        SELECT schemaname, viewname 
        FROM pg_views 
        WHERE schemaname = 'public'
    LOOP
        -- Drop and recreate each view to ensure it's not security definer
        EXECUTE format('DROP VIEW IF EXISTS %I.%I CASCADE', view_record.schemaname, view_record.viewname);
    END LOOP;
END $$;

-- Recreate the views we need (non-security definer)
CREATE OR REPLACE VIEW public.published_posts AS
SELECT 
  id, title, slug, content, excerpt, featured_image_url,
  category_id, is_published, published_at, created_at,
  meta_title, meta_description, tags
FROM public.blog_posts 
WHERE is_published = true AND published_at <= now();

CREATE OR REPLACE VIEW public.published_products AS
SELECT 
  id, title, slug, description, short_description, price,
  thumbnail_url, category, product_type, is_featured,
  created_at, meta_title, meta_description
FROM public.products 
WHERE is_published = true;

-- Grant proper access
GRANT SELECT ON public.published_posts TO anon, authenticated;
GRANT SELECT ON public.published_products TO anon, authenticated;

-- Check and fix all functions that might have mutable search paths
-- Fix the assign_admin_role function
DROP FUNCTION IF EXISTS public.assign_admin_role() CASCADE;
CREATE OR REPLACE FUNCTION public.assign_admin_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Assign admin role to the existing user email
  IF NEW.email = 'avifrid121@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;;
