
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
;
