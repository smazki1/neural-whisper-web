import assert from 'node:assert/strict';
import test from 'node:test';

import { resolveProductImageUrl } from '../src/lib/productImage.js';

const fallbackUrl = '/assets/course-cover-fallback.jpg';

test('private lesson content public URLs fall back to a displayable image', () => {
  const privateBucketUrl =
    'https://ekqmbmfkzmqcxthsdgwg.supabase.co/storage/v1/object/public/lesson-content/courses/covers/new-1781104847091.jpeg';

  assert.equal(resolveProductImageUrl(privateBucketUrl, fallbackUrl), fallbackUrl);
});

test('valid public product image URLs are preserved', () => {
  const publicUrl =
    'https://ekqmbmfkzmqcxthsdgwg.supabase.co/storage/v1/object/public/product-images/course-cover.jpeg';

  assert.equal(resolveProductImageUrl(publicUrl, fallbackUrl), publicUrl);
});

test('missing image URLs use the fallback', () => {
  assert.equal(resolveProductImageUrl(null, fallbackUrl), fallbackUrl);
  assert.equal(resolveProductImageUrl('   ', fallbackUrl), fallbackUrl);
});
