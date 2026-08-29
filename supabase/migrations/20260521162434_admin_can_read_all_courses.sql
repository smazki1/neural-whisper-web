CREATE POLICY "admin read all courses"
  ON courses FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));;
