
-- וובינרים
CREATE TABLE IF NOT EXISTS webinars (
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

-- מדריכים (מחליף סרטונים)
CREATE TABLE IF NOT EXISTS guides (
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
  updated_at timestamptz DEFAULT now()
);

-- יומן לייבים
CREATE TABLE IF NOT EXISTS live_events (
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

-- כלים
CREATE TABLE IF NOT EXISTS tools (
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
  updated_at timestamptz DEFAULT now()
);

-- הנחיות / Prompts
CREATE TABLE IF NOT EXISTS prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  content text NOT NULL,
  category text DEFAULT 'general',
  published boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE webinars ENABLE ROW LEVEL SECURITY;
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

-- Public read for published content
CREATE POLICY "public read webinars" ON webinars FOR SELECT USING (published = true);
CREATE POLICY "public read guides" ON guides FOR SELECT USING (published = true);
CREATE POLICY "public read live_events" ON live_events FOR SELECT USING (published = true);
CREATE POLICY "public read tools" ON tools FOR SELECT USING (published = true);
CREATE POLICY "public read prompts" ON prompts FOR SELECT USING (published = true);

-- Admin full access (service role bypasses RLS anyway)
CREATE POLICY "admin all webinars" ON webinars FOR ALL USING (true);
CREATE POLICY "admin all guides" ON guides FOR ALL USING (true);
CREATE POLICY "admin all live_events" ON live_events FOR ALL USING (true);
CREATE POLICY "admin all tools" ON tools FOR ALL USING (true);
CREATE POLICY "admin all prompts" ON prompts FOR ALL USING (true);
;
