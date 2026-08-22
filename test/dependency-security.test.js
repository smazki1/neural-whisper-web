import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('legacy React Quill package is not installed', async () => {
  const packageJson = JSON.parse(
    await readFile(new URL('../package.json', import.meta.url), 'utf8'),
  );

  assert.equal(packageJson.dependencies?.['react-quill'], undefined);
});

test('React Quill resolves to a release without the Quill 2.0.3 advisory', async () => {
  const packageJson = JSON.parse(
    await readFile(new URL('../package.json', import.meta.url), 'utf8'),
  );

  assert.equal(packageJson.dependencies?.['react-quill-new'], '3.7.0');
  assert.equal(packageJson.overrides?.quill, '2.0.2');
});
