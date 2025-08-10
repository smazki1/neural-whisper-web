-- Safely create enums if not exist
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'course_category') THEN
    CREATE TYPE public.course_category AS ENUM ('strategy','marketing','tech');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'course_level') THEN
    CREATE TYPE public.course_level AS ENUM ('beginner','intermediate','advanced');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'resource_type') THEN
    CREATE TYPE public.resource_type AS ENUM ('video','pdf','slides','link');
  END IF;
END $$;

-- Tables
CREATE TABLE IF NOT EXISTS public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  category public.course_category NOT NULL,
  level public.course_level NOT NULL,
  duration text,
  description text,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  position int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title text NOT NULL,
  duration text,
  content text,
  position int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  type public.resource_type NOT NULL,
  label text,
  url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_courses_updated_at'
  ) THEN
    CREATE TRIGGER trg_courses_updated_at
    BEFORE UPDATE ON public.courses
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_modules_updated_at'
  ) THEN
    CREATE TRIGGER trg_modules_updated_at
    BEFORE UPDATE ON public.modules
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_lessons_updated_at'
  ) THEN
    CREATE TRIGGER trg_lessons_updated_at
    BEFORE UPDATE ON public.lessons
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_resources_updated_at'
  ) THEN
    CREATE TRIGGER trg_resources_updated_at
    BEFORE UPDATE ON public.resources
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Policies for courses
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'courses' AND policyname = 'Public can view published courses'
  ) THEN
    CREATE POLICY "Public can view published courses"
      ON public.courses FOR SELECT
      USING (published = true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'courses' AND policyname = 'Users can view their own courses'
  ) THEN
    CREATE POLICY "Users can view their own courses"
      ON public.courses FOR SELECT TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'courses' AND policyname = 'Users can insert their own courses'
  ) THEN
    CREATE POLICY "Users can insert their own courses"
      ON public.courses FOR INSERT TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'courses' AND policyname = 'Users can update their own courses'
  ) THEN
    CREATE POLICY "Users can update their own courses"
      ON public.courses FOR UPDATE TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'courses' AND policyname = 'Users can delete their own courses'
  ) THEN
    CREATE POLICY "Users can delete their own courses"
      ON public.courses FOR DELETE TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Policies for modules
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'modules' AND policyname = 'Public can view modules of published courses'
  ) THEN
    CREATE POLICY "Public can view modules of published courses"
      ON public.modules FOR SELECT
      USING (EXISTS (
        SELECT 1 FROM public.courses c
        WHERE c.id = modules.course_id AND (c.published = true OR c.user_id = auth.uid())
      ));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'modules' AND policyname = 'Owners can modify modules'
  ) THEN
    CREATE POLICY "Owners can modify modules"
      ON public.modules FOR ALL TO authenticated
      USING (EXISTS (
        SELECT 1 FROM public.courses c
        WHERE c.id = modules.course_id AND c.user_id = auth.uid()
      ))
      WITH CHECK (EXISTS (
        SELECT 1 FROM public.courses c
        WHERE c.id = modules.course_id AND c.user_id = auth.uid()
      ));
  END IF;
END $$;

-- Policies for lessons
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'lessons' AND policyname = 'Public can view lessons of published courses'
  ) THEN
    CREATE POLICY "Public can view lessons of published courses"
      ON public.lessons FOR SELECT
      USING (EXISTS (
        SELECT 1 FROM public.courses c
        JOIN public.modules m ON m.course_id = c.id
        WHERE m.id = lessons.module_id AND (c.published = true OR c.user_id = auth.uid())
      ));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'lessons' AND policyname = 'Owners can modify lessons'
  ) THEN
    CREATE POLICY "Owners can modify lessons"
      ON public.lessons FOR ALL TO authenticated
      USING (EXISTS (
        SELECT 1 FROM public.courses c
        JOIN public.modules m ON m.course_id = c.id
        WHERE m.id = lessons.module_id AND c.user_id = auth.uid()
      ))
      WITH CHECK (EXISTS (
        SELECT 1 FROM public.courses c
        JOIN public.modules m ON m.course_id = c.id
        WHERE m.id = lessons.module_id AND c.user_id = auth.uid()
      ));
  END IF;
END $$;

-- Policies for resources
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'resources' AND policyname = 'Public can view resources of published courses'
  ) THEN
    CREATE POLICY "Public can view resources of published courses"
      ON public.resources FOR SELECT
      USING (EXISTS (
        SELECT 1 FROM public.courses c
        JOIN public.modules m ON m.course_id = c.id
        JOIN public.lessons l ON l.module_id = m.id
        WHERE l.id = resources.lesson_id AND (c.published = true OR c.user_id = auth.uid())
      ));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'resources' AND policyname = 'Owners can modify resources'
  ) THEN
    CREATE POLICY "Owners can modify resources"
      ON public.resources FOR ALL TO authenticated
      USING (EXISTS (
        SELECT 1 FROM public.courses c
        JOIN public.modules m ON m.course_id = c.id
        JOIN public.lessons l ON l.module_id = m.id
        WHERE l.id = resources.lesson_id AND c.user_id = auth.uid()
      ))
      WITH CHECK (EXISTS (
        SELECT 1 FROM public.courses c
        JOIN public.modules m ON m.course_id = c.id
        JOIN public.lessons l ON l.module_id = m.id
        WHERE l.id = resources.lesson_id AND c.user_id = auth.uid()
      ));
  END IF;
END $$;