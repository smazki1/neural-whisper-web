
-- Add missing columns to courses table
ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS slug text UNIQUE,
  ADD COLUMN IF NOT EXISTS thumbnail_url text,
  ADD COLUMN IF NOT EXISTS trailer_url text,
  ADD COLUMN IF NOT EXISTS instructor_name text,
  ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;

-- Add missing columns to lessons table
ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS video_url text,
  ADD COLUMN IF NOT EXISTS video_provider text CHECK (video_provider IN ('youtube', 'vimeo', 'loom')),
  ADD COLUMN IF NOT EXISTS duration_minutes integer,
  ADD COLUMN IF NOT EXISTS is_preview boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS content_json jsonb,
  ADD COLUMN IF NOT EXISTS resources_json jsonb;

-- Create user_bookmarks table
CREATE TABLE IF NOT EXISTS public.user_bookmarks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own bookmarks" ON public.user_bookmarks
  FOR ALL USING (auth.uid() = user_id);

-- Create content_items table for webinars and how-to videos
CREATE TABLE IF NOT EXISTS public.content_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  type text NOT NULL CHECK (type IN ('webinar', 'video')),
  title text NOT NULL,
  description text,
  video_url text,
  thumbnail_url text,
  content_json jsonb,
  is_published boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  published_at timestamptz,
  duration_minutes integer,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published items are publicly readable" ON public.content_items
  FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage content items" ON public.content_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- RLS policies for user_progress (add if missing)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_progress' AND policyname = 'Users manage own progress'
  ) THEN
    CREATE POLICY "Users manage own progress" ON public.user_progress
      FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- RLS policies for courses (readable by all authenticated users)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'courses' AND policyname = 'Courses readable by authenticated users'
  ) THEN
    CREATE POLICY "Courses readable by authenticated users" ON public.courses
      FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- RLS policies for modules
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'modules' AND policyname = 'Modules readable by authenticated users'
  ) THEN
    CREATE POLICY "Modules readable by authenticated users" ON public.modules
      FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- RLS policies for lessons
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'lessons' AND policyname = 'Lessons readable by authenticated users'
  ) THEN
    CREATE POLICY "Lessons readable by authenticated users" ON public.lessons
      FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
END $$;
;
