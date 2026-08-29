
ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS is_free          boolean       NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS price            numeric(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount_price   numeric(10,2) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS currency         text          NOT NULL DEFAULT 'ILS',
  ADD COLUMN IF NOT EXISTS access_type      text          NOT NULL DEFAULT 'members_only',
  ADD COLUMN IF NOT EXISTS enrollment_status text         NOT NULL DEFAULT 'open',
  ADD COLUMN IF NOT EXISTS enrollment_deadline timestamptz DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS max_students     integer       DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS has_certificate  boolean       NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS language         text          NOT NULL DEFAULT 'he',
  ADD COLUMN IF NOT EXISTS requirements     text          DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS what_you_learn   text          DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS tags             text[]        DEFAULT '{}';
;
