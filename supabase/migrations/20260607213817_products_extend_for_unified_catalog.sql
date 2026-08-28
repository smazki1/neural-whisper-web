-- Extend products into the unified catalog/commerce spine
ALTER TABLE products ALTER COLUMN category DROP NOT NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS icount_page_url text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS discount_price numeric;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_free boolean NOT NULL DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS display_order int NOT NULL DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS course_id uuid REFERENCES courses(id) ON DELETE SET NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS persona text;

CREATE INDEX IF NOT EXISTS products_type_published_idx ON products(product_type, is_published, display_order);
CREATE INDEX IF NOT EXISTS products_course_idx ON products(course_id);

-- RLS (table already has rls_enabled). Public reads published, admins manage all.
DROP POLICY IF EXISTS "public read published products" ON products;
CREATE POLICY "public read published products"
  ON products FOR SELECT TO public
  USING (is_published = true);

DROP POLICY IF EXISTS "admin all products" ON products;
CREATE POLICY "admin all products"
  ON products FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));;
