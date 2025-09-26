-- Add missing fields to leads table
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS follow_up_date DATE,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Update products table to ensure it has all required fields
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT;

-- Update blog_posts table to ensure it has all required fields for posts
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_follow_up ON public.leads(follow_up_date) WHERE follow_up_date IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(is_published);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);

CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON public.blog_posts USING GIN(tags);

-- Ensure RLS is enabled on all tables
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Update RLS policies for leads table (add admin delete policy if missing)
DROP POLICY IF EXISTS "Admins can delete leads" ON public.leads;
CREATE POLICY "Admins can delete leads" 
ON public.leads 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Ensure proper RLS policies for products
DROP POLICY IF EXISTS "Admins can manage all products" ON public.products;
CREATE POLICY "Admins can manage all products" 
ON public.products 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Published products are viewable by everyone" ON public.products;
CREATE POLICY "Published products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (is_published = true);

-- Ensure proper RLS policies for blog posts
DROP POLICY IF EXISTS "Published blog posts are viewable by everyone" ON public.blog_posts;
CREATE POLICY "Published blog posts are viewable by everyone" 
ON public.blog_posts 
FOR SELECT 
USING (is_published = true);

DROP POLICY IF EXISTS "Admins can manage all blog posts" ON public.blog_posts;
CREATE POLICY "Admins can manage all blog posts" 
ON public.blog_posts 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create a view for public content (optional, for easier querying)
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

-- Grant access to views
GRANT SELECT ON public.published_posts TO anon, authenticated;
GRANT SELECT ON public.published_products TO anon, authenticated;