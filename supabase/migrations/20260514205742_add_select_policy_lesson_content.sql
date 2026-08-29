-- Allow public read access on lesson-content storage objects.
-- This is required so the supabase-js storage client (and the Storage server's
-- internal upsert logic) can read object metadata. The bucket is already public,
-- but Supabase still requires an explicit RLS SELECT policy on storage.objects.
CREATE POLICY "Public read lesson content"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'lesson-content');;
