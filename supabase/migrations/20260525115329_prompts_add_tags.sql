-- Add tags array column to prompts
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}';

-- Backfill: existing category becomes the first tag (skip 'general' / null / empty)
UPDATE prompts
SET tags = ARRAY[trim(category)]
WHERE (tags IS NULL OR cardinality(tags) = 0)
  AND category IS NOT NULL
  AND trim(category) <> ''
  AND lower(trim(category)) <> 'general';

-- GIN index for fast tag containment search
CREATE INDEX IF NOT EXISTS prompts_tags_gin_idx ON prompts USING gin (tags);;
