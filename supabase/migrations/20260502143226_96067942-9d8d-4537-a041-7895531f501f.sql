
-- These content tables existed in Production before migration history was
-- committed. Reconcile them here so a clean checkout can build the schema.
CREATE TABLE IF NOT EXISTS public.webinars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  thumbnail_url text,
  video_url text,
  scheduled_at timestamptz,
  duration_minutes integer DEFAULT 60,
  is_live boolean DEFAULT false,
  published boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.live_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer DEFAULT 60,
  meeting_url text,
  is_recorded boolean DEFAULT false,
  recording_url text,
  published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  url text,
  icon_url text,
  category text DEFAULT 'general',
  is_free boolean DEFAULT true,
  published boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  featured boolean NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS public.guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  thumbnail_url text,
  video_url text,
  duration_minutes integer,
  category text DEFAULT 'general',
  level text DEFAULT 'beginner',
  published boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  content text DEFAULT '',
  slug text,
  tags text[] DEFAULT '{}',
  is_free boolean NOT NULL DEFAULT true,
  language text NOT NULL DEFAULT 'he',
  cover_url text
);

CREATE TABLE IF NOT EXISTS public.prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  content text NOT NULL,
  category text DEFAULT 'general',
  published boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  guide_id uuid REFERENCES public.guides(id) ON DELETE SET NULL,
  tags text[] NOT NULL DEFAULT '{}',
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  is_sample boolean NOT NULL DEFAULT false,
  parts jsonb NOT NULL DEFAULT '[]'::jsonb,
  how_to_use text,
  featured boolean NOT NULL DEFAULT false,
  pack_section_id uuid,
  pack_display_order integer NOT NULL DEFAULT 0,
  image_url text,
  topic_id uuid,
  topic_ids uuid[] NOT NULL DEFAULT '{}'
);

ALTER TABLE public.webinars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin all webinars" ON public.webinars;
CREATE POLICY "admin all webinars" ON public.webinars
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "admin all live_events" ON public.live_events;
CREATE POLICY "admin all live_events" ON public.live_events
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "admin all tools" ON public.tools;
CREATE POLICY "admin all tools" ON public.tools
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "admin all prompts" ON public.prompts;
CREATE POLICY "admin all prompts" ON public.prompts
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "admin all guides" ON public.guides;
CREATE POLICY "admin all guides" ON public.guides
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "public read live_events" ON public.live_events;
CREATE POLICY "auth read live_events" ON public.live_events
  FOR SELECT TO authenticated
  USING (published = true OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE VIEW public.live_events_public
WITH (security_invoker = true) AS
  SELECT id, title, description, scheduled_at, duration_minutes,
         is_recorded, recording_url, published, created_at, updated_at
  FROM public.live_events
  WHERE published = true;

GRANT SELECT ON public.live_events_public TO anon, authenticated;

DROP POLICY IF EXISTS "System can insert course access" ON public.user_course_access;
CREATE POLICY "Users can insert own course access via paid order" ON public.user_course_access
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = user_course_access.order_id
        AND o.user_id = auth.uid()
        AND o.status = 'completed'::order_status
    )
  );

CREATE POLICY "Admins can insert course access" ON public.user_course_access
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Public can view blog images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view blog-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own blog images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to blog-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete from blog-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update blog-images" ON storage.objects;

CREATE POLICY "Public read blog-images" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'blog-images');

CREATE POLICY "Admins upload blog-images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update blog-images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete blog-images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'::app_role));

DROP VIEW IF EXISTS public.published_posts;
CREATE VIEW public.published_posts
WITH (security_invoker = true) AS
  SELECT id, title, slug, content, excerpt, featured_image_url, category_id,
         is_published, published_at, created_at, meta_title, meta_description, tags
  FROM public.blog_posts
  WHERE is_published = true AND published_at <= now();

DROP VIEW IF EXISTS public.published_products;
CREATE VIEW public.published_products
WITH (security_invoker = true) AS
  SELECT id, title, slug, description, short_description, price, thumbnail_url,
         category, product_type, is_featured, created_at, meta_title, meta_description
  FROM public.products
  WHERE is_published = true;

GRANT SELECT ON public.published_posts TO anon, authenticated;
GRANT SELECT ON public.published_products TO anon, authenticated;

ALTER FUNCTION public.update_site_settings_updated_at() SET search_path = public;
ALTER FUNCTION public.make_user_admin(text) SET search_path = public;
