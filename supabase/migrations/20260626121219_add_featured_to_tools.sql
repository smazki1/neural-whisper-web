ALTER TABLE tools ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS tools_featured_idx ON tools (featured) WHERE featured = true;;
