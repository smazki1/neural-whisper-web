
-- 1. Remove tables from Realtime publication (prevents broadcasting role/profile changes)
ALTER PUBLICATION supabase_realtime DROP TABLE public.user_roles;
ALTER PUBLICATION supabase_realtime DROP TABLE public.profiles;
ALTER PUBLICATION supabase_realtime DROP TABLE public.courses;
ALTER PUBLICATION supabase_realtime DROP TABLE public.modules;
ALTER PUBLICATION supabase_realtime DROP TABLE public.lessons;
ALTER PUBLICATION supabase_realtime DROP TABLE public.resources;

-- 2. Drop blanket authenticated-readable policies
DROP POLICY IF EXISTS "Courses readable by authenticated users" ON public.courses;
DROP POLICY IF EXISTS "Modules readable by authenticated users" ON public.modules;
DROP POLICY IF EXISTS "Lessons readable by authenticated users" ON public.lessons;

-- Add proper enrollment-based access for lessons & modules
CREATE POLICY "Enrolled users can view lessons"
ON public.lessons
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.modules m
    JOIN public.user_course_access uca ON uca.course_id = m.course_id
    WHERE m.id = lessons.module_id AND uca.user_id = auth.uid()
  )
);

CREATE POLICY "Enrolled users can view modules"
ON public.modules
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_course_access uca
    WHERE uca.course_id = modules.course_id AND uca.user_id = auth.uid()
  )
);

CREATE POLICY "Enrolled users can view courses"
ON public.courses
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_course_access uca
    WHERE uca.course_id = courses.id AND uca.user_id = auth.uid()
  )
);

-- 3. Standardize lesson-content storage admin checks
DROP POLICY IF EXISTS "Admins can upload lesson content" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete lesson content" ON storage.objects;

CREATE POLICY "Admins can upload lesson content"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'lesson-content' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update lesson content"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'lesson-content' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can delete lesson content"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'lesson-content' AND public.has_role(auth.uid(), 'admin'::public.app_role));

-- 4. Restrict listing on public buckets (files still accessible via direct public URL)
DROP POLICY IF EXISTS "Anyone can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Public can read lesson content" ON storage.objects;
DROP POLICY IF EXISTS "Public read blog-images" ON storage.objects;

-- 5. Lock down SECURITY DEFINER functions - revoke broad EXECUTE
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.assign_admin_role() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_site_settings_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.make_user_admin(text) FROM PUBLIC, anon, authenticated;

-- has_role is needed inside RLS — keep it callable by authenticated only
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
