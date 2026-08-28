CREATE TABLE course_pages (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id     uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  parent_id     uuid REFERENCES course_pages(id) ON DELETE CASCADE,
  title         text NOT NULL,
  slug          text NOT NULL DEFAULT '',
  icon          text DEFAULT '',
  cover_url     text DEFAULT '',
  content       text DEFAULT '',
  display_order int DEFAULT 0,
  is_home       boolean DEFAULT false,
  published     boolean DEFAULT false,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

CREATE INDEX course_pages_course_parent_order_idx
  ON course_pages(course_id, parent_id NULLS FIRST, display_order);

CREATE UNIQUE INDEX course_pages_course_slug_uq
  ON course_pages(course_id, slug)
  WHERE slug <> '';

CREATE UNIQUE INDEX course_pages_one_home_per_course
  ON course_pages(course_id)
  WHERE is_home = true;

ALTER TABLE course_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read course pages"
  ON course_pages FOR SELECT TO public
  USING (published = true);

CREATE POLICY "admin all course pages"
  ON course_pages FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));;
