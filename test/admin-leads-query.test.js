import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('the navigation only enables the leads query for administrators', async () => {
  const navbar = await readFile(
    new URL('../src/components/Navbar.tsx', import.meta.url),
    'utf8',
  );
  const hook = await readFile(
    new URL('../src/hooks/useNewLeadsCount.ts', import.meta.url),
    'utf8',
  );

  assert.match(navbar, /useNewLeadsCount\(isAdmin\)/);
  assert.match(hook, /useNewLeadsCount\s*=\s*\(enabled:\s*boolean\)/);
  assert.match(hook, /if\s*\(!enabled\)\s*return/);
});
