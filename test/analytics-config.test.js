import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeGoogleAnalyticsId } from '../src/lib/analyticsConfig.js';

test('accepts a configured GA4 measurement ID', () => {
  assert.equal(normalizeGoogleAnalyticsId(' G-ABC123DEF4 '), 'G-ABC123DEF4');
});

test('rejects missing and placeholder analytics IDs', () => {
  assert.equal(normalizeGoogleAnalyticsId(undefined), null);
  assert.equal(normalizeGoogleAnalyticsId('G-XXXXXXXXXX'), null);
  assert.equal(normalizeGoogleAnalyticsId('UA-12345'), null);
});
