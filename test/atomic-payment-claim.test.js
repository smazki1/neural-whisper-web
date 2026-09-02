import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import test from 'node:test';

test('claim-payment delegates all payment state changes to one protected RPC', async () => {
  const claimPayment = await readFile(
    new URL('../supabase/functions/claim-payment/index.ts', import.meta.url),
    'utf8',
  );
  const migrationsUrl = new URL('../supabase/migrations/', import.meta.url);
  const migrationFiles = await readdir(migrationsUrl);
  const migrations = (
    await Promise.all(migrationFiles.map((name) => readFile(new URL(name, migrationsUrl), 'utf8')))
  ).join('\n');

  assert.match(claimPayment, /auth\.getUser\(token\)/);
  assert.match(claimPayment, /\.rpc\(["']claim_payment_transaction["']/);
  assert.doesNotMatch(claimPayment, /\.from\(["']payment_intents["']\)/);
  assert.doesNotMatch(claimPayment, /\.from\(["']entitlements["']\)/);

  assert.match(migrations, /create or replace function public\.claim_payment_transaction/i);
  assert.match(migrations, /for update of payment_intents/i);
  assert.match(migrations, /security invoker/i);
  assert.match(
    migrations,
    /revoke all on function public\.claim_payment_transaction\(uuid, uuid, text\)[\s\S]*from public, anon, authenticated/i,
  );
  assert.match(
    migrations,
    /grant execute on function public\.claim_payment_transaction\(uuid, uuid, text\)[\s\S]*to service_role/i,
  );
});
