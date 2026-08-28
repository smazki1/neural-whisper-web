
ALTER TABLE guides
  ADD COLUMN IF NOT EXISTS content      text    DEFAULT '',
  ADD COLUMN IF NOT EXISTS slug         text    DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS tags         text[]  DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS is_free      boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS language     text    NOT NULL DEFAULT 'he',
  ADD COLUMN IF NOT EXISTS cover_url    text    DEFAULT NULL;
;
