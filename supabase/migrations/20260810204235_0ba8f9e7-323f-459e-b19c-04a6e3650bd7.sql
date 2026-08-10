-- 1) Lessons: restrict public read to free courses / preview lessons
DROP POLICY IF EXISTS "Public can view lessons of published courses" ON public.lessons;
CREATE POLICY "Public can view free or preview lessons"
ON public.lessons FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.courses c
    JOIN public.modules m ON m.course_id = c.id
    WHERE m.id = lessons.module_id
      AND (
        c.user_id = auth.uid()
        OR (c.published = true AND (c.is_free = true OR lessons.is_preview = true))
      )
  )
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

-- 2) Modules: restrict public read to free courses
DROP POLICY IF EXISTS "Public can view modules of published courses" ON public.modules;
CREATE POLICY "Public can view modules of free courses"
ON public.modules FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.courses c
    WHERE c.id = modules.course_id
      AND (c.user_id = auth.uid() OR (c.published = true AND c.is_free = true))
  )
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

-- 3) Resources: restrict public read to free courses / preview lessons
DROP POLICY IF EXISTS "Public can view resources of published courses" ON public.resources;
CREATE POLICY "Public can view resources of free or preview lessons"
ON public.resources FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.courses c
    JOIN public.modules m ON m.course_id = c.id
    JOIN public.lessons l ON l.module_id = m.id
    WHERE l.id = resources.lesson_id
      AND (
        c.user_id = auth.uid()
        OR (c.published = true AND (c.is_free = true OR l.is_preview = true))
      )
  )
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Enrolled users can view resources"
ON public.resources FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.lessons l
    JOIN public.modules m ON m.id = l.module_id
    JOIN public.user_course_access uca ON uca.course_id = m.course_id
    WHERE l.id = resources.lesson_id AND uca.user_id = auth.uid()
  )
);

-- 4) Public curriculum (titles only, no paid content) for course pages
CREATE OR REPLACE FUNCTION public.course_curriculum(p_course_id uuid)
RETURNS TABLE(
  module_id uuid,
  module_title text,
  module_description text,
  module_position integer,
  lesson_id uuid,
  lesson_title text,
  lesson_position integer,
  duration text,
  duration_minutes integer,
  is_preview boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT m.id, m.title, m.description, m.position,
         l.id, l.title, l.position, l.duration, l.duration_minutes, coalesce(l.is_preview, false)
  FROM courses c
  JOIN modules m ON m.course_id = c.id
  LEFT JOIN lessons l ON l.module_id = m.id
  WHERE c.id = p_course_id
    AND (c.published = true OR c.user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
  ORDER BY m.position, l.position;
$$;

GRANT EXECUTE ON FUNCTION public.course_curriculum(uuid) TO anon, authenticated;

-- 5) Profiles: no longer world-readable for every account
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public can view published authors and instructors"
ON public.profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.blog_posts bp
    WHERE bp.author_id = profiles.id AND bp.is_published = true
  )
  OR EXISTS (
    SELECT 1 FROM public.courses c
    WHERE c.user_id = profiles.id AND c.published = true
  )
);

-- 6) Storage: entitlement-gated read for lesson-content (bucket already private)
DROP POLICY IF EXISTS "Public read lesson content" ON storage.objects;

CREATE POLICY "Entitled users can read lesson content"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'lesson-content'
  AND (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.user_course_access uca WHERE uca.user_id = auth.uid()
    )
  )
);

-- 7) Fix mutable search_path
CREATE OR REPLACE FUNCTION public.prompts_validate_pack_section()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
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
$function$;