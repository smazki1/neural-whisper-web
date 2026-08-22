import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('admin routes are loaded in separate chunks', async () => {
  const appSource = await readFile(new URL('../src/App.tsx', import.meta.url), 'utf8');

  assert.match(appSource, /const AdminSettings = lazy\(/);
  assert.doesNotMatch(appSource, /import AdminSettings from/);
});
