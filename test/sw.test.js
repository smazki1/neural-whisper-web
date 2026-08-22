import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import vm from 'node:vm';

test('service-worker activation cleans up without navigating clients', async () => {
  const source = await readFile(new URL('../public/sw.js', import.meta.url), 'utf8');
  const listeners = new Map();
  const deletedCaches = [];
  const navigateCalls = [];
  let claimed = false;
  let unregistered = false;

  const clients = {
    async claim() {
      claimed = true;
    },
    async matchAll() {
      return [{ url: '/avi', navigate: (url) => navigateCalls.push(url) }];
    },
  };
  const self = {
    clients,
    registration: {
      async unregister() {
        unregistered = true;
      },
    },
    addEventListener(type, handler) {
      listeners.set(type, handler);
    },
    skipWaiting() {},
  };
  const caches = {
    async keys() {
      return ['old-shell', 'old-assets'];
    },
    async delete(name) {
      deletedCaches.push(name);
      return true;
    },
  };

  vm.runInNewContext(source, { self, caches });
  const waitUntilPromises = [];
  listeners.get('activate')({
    waitUntil(promise) {
      waitUntilPromises.push(promise);
    },
  });
  await Promise.all(waitUntilPromises);

  assert.deepEqual(deletedCaches.sort(), ['old-assets', 'old-shell']);
  assert.equal(claimed, true);
  assert.equal(unregistered, true);
  assert.deepEqual(navigateCalls, []);
});
