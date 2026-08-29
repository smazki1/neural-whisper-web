-- Single unified access ledger for ALL purchases (course / prompt_pack / workshop)
CREATE TABLE entitlements (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id                uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  status                    text NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending','paid','refunded','failed')),
  amount_paid               numeric,
  icount_doc_number         text,
  icount_confirmation_code  text,
  icount_doc_url            text,
  created_at                timestamptz NOT NULL DEFAULT now(),
  granted_at                timestamptz
);

-- One active (paid) entitlement per user+product
CREATE UNIQUE INDEX entitlements_user_product_paid_idx
  ON entitlements(user_id, product_id)
  WHERE status = 'paid';
CREATE INDEX entitlements_user_idx ON entitlements(user_id, status);

ALTER TABLE entitlements ENABLE ROW LEVEL SECURITY;

-- User can read their own entitlements
CREATE POLICY "user reads own entitlements"
  ON entitlements FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- User can create a pending entitlement for themselves (the buy click)
CREATE POLICY "user inserts own pending entitlement"
  ON entitlements FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- Admin full access
CREATE POLICY "admin all entitlements"
  ON entitlements FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
-- (the webhook updates via service role key, which bypasses RLS);
