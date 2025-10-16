-- Storage policies for blog-images bucket

-- Allow authenticated users to upload images to blog-images bucket
CREATE POLICY "Authenticated users can upload to blog-images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-images');

-- Allow public to view images in blog-images bucket (since bucket is public)
CREATE POLICY "Anyone can view blog-images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'blog-images');

-- Allow authenticated users to delete their own images
CREATE POLICY "Authenticated users can delete from blog-images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'blog-images');

-- Allow authenticated users to update images in blog-images
CREATE POLICY "Authenticated users can update blog-images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'blog-images')
WITH CHECK (bucket_id = 'blog-images');