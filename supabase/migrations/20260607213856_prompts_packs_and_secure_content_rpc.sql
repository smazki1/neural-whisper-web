-- Prompt → pack membership + free-taste flag
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS product_id uuid REFERENCES products(id) ON DELETE SET NULL;
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS is_sample boolean NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS prompts_product_idx ON prompts(product_id);

-- Secure gated-content accessor: returns content only if the prompt is
-- free (no pack), a free sample, or the caller owns the pack. Else NULL.
CREATE OR REPLACE FUNCTION prompt_content(p_id uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN p.published IS NOT TRUE THEN NULL
    WHEN p.product_id IS NULL OR p.is_sample THEN p.content
    WHEN auth.uid() IS NOT NULL AND EXISTS (
      SELECT 1 FROM entitlements e
      WHERE e.user_id = auth.uid()
        AND e.product_id = p.product_id
        AND e.status = 'paid'
    ) THEN p.content
    ELSE NULL
  END
  FROM prompts p
  WHERE p.id = p_id;
$$;

GRANT EXECUTE ON FUNCTION prompt_content(uuid) TO anon, authenticated;;
