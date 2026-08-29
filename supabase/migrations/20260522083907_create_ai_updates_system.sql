-- ── Sources Avi can manage without code ──
CREATE TABLE ai_sources (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  type          text NOT NULL DEFAULT 'rss',
  url           text NOT NULL,
  enabled       boolean NOT NULL DEFAULT true,
  last_fetched_at timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ── Daily AI update cards (two depth levels) ──
CREATE TABLE ai_updates (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  source          text DEFAULT '',
  source_url      text DEFAULT '',
  raw_excerpt     text DEFAULT '',
  title           text NOT NULL DEFAULT '',
  summary_html    text DEFAULT '',
  expanded_html   text DEFAULT '',
  relevance_score int DEFAULT 0,
  category        text DEFAULT '',
  status          text NOT NULL DEFAULT 'draft',  -- draft|approved|published|rejected
  published_at    timestamptz,
  approval_token  uuid NOT NULL DEFAULT gen_random_uuid(),
  dedup_hash      text DEFAULT ''
);

CREATE INDEX ai_updates_status_pub_idx ON ai_updates(status, published_at DESC);
CREATE INDEX ai_updates_dedup_idx ON ai_updates(dedup_hash);
CREATE UNIQUE INDEX ai_updates_token_idx ON ai_updates(approval_token);

ALTER TABLE ai_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_updates ENABLE ROW LEVEL SECURITY;

-- Public reads only published updates
CREATE POLICY "public read published ai_updates"
  ON ai_updates FOR SELECT TO public
  USING (status = 'published');

-- Admins manage everything
CREATE POLICY "admin all ai_updates"
  ON ai_updates FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "admin all ai_sources"
  ON ai_sources FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Seed MVP sources (official RSS / blogs)
INSERT INTO ai_sources (name, type, url) VALUES
  ('OpenAI News', 'rss', 'https://openai.com/news/rss.xml'),
  ('Google AI Blog', 'rss', 'https://blog.google/technology/ai/rss/'),
  ('Anthropic News', 'rss', 'https://www.anthropic.com/news'),
  ('Cursor Changelog', 'rss', 'https://www.cursor.com/changelog');;
