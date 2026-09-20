import test from 'node:test';
import assert from 'node:assert/strict';
import { getHomepageCatalogs, getProductDestination, getProductSummary } from '../src/lib/homepageCatalog.js';
const course = { id: 'course', is_published: true, is_featured: false, product_type: 'course', category: null, slug: 'course-slug' };
const workshop = { id: 'workshop', is_published: true, product_type: 'workshop', category: 'business', display_order: 1 };

test('published courses appear without requiring featured or a category; unpublished records never appear', () => {
  const data = [course, { ...course, id: 'draft', is_published: false }, { ...course, id: 'null', is_published: null }];
  assert.deepEqual(getHomepageCatalogs(data).courses.map(p => p.id), ['course']);
  assert.deepEqual(getHomepageCatalogs([{ ...course, is_published: false }]).courses, []);
});
test('organization catalog is separated from courses, consumer workshops, consultations and prompt packs', () => {
  const data = [course, workshop, { ...workshop, id: 'consumer', category: 'basic' }, { ...workshop, id: 'draft', is_published: false }, { ...workshop, product_type: 'consultation' }, { ...workshop, product_type: 'prompt_pack' }];
  assert.deepEqual(getHomepageCatalogs(data).organizations.map(p => p.id), ['workshop']);
});
test('catalogs respect display order and empty data', () => {
  assert.deepEqual(getHomepageCatalogs([]), { courses: [], organizations: [] });
  assert.deepEqual(getHomepageCatalogs([{ ...course, id: 'later', display_order: 2 }, { ...course, id: 'earlier', display_order: 0 }]).courses.map(p => p.id), ['earlier', 'later']);
});
test('destinations use configured links or existing detail routes, and descriptions prefer short copy', () => {
  assert.equal(getProductDestination(course), '/products/course-slug');
  assert.equal(getProductDestination({ ...course, external_url: 'https://example.com/course' }), 'https://example.com/course');
  assert.equal(getProductDestination({ ...course, external_url: '/corporate-workshops' }), '/corporate-workshops');
  assert.equal(getProductDestination({ ...course, external_url: 'javascript:alert(1)' }), '/products/course-slug');
  assert.equal(getProductSummary({ short_description: 'קצר', description: 'ארוך' }), 'קצר');
  assert.equal(getProductSummary({ description: '<p>קיים</p>' }), 'קיים');
});
