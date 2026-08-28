ALTER TABLE prompts
  ADD COLUMN guide_id uuid REFERENCES guides(id) ON DELETE SET NULL;

CREATE INDEX prompts_guide_id_idx ON prompts(guide_id) WHERE guide_id IS NOT NULL;;
