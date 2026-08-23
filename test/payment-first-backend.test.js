import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import test from 'node:test';

const readOrEmpty = async (url) => readFile(url, 'utf8').catch(() => '');

test('payment-first purchases use private intents and authenticated claims', async () => {
  const migrationsUrl = new URL('../supabase/migrations/', import.meta.url);
  const migrationFiles = await readdir(migrationsUrl);
  const migrationBodies = await Promise.all(
    migrationFiles.map((name) => readFile(new URL(name, migrationsUrl), 'utf8')),
  );
  const migrations = migrationBodies.join('\n');
  const createIntent = await readOrEmpty(
    new URL('../supabase/functions/create-payment-intent/index.ts', import.meta.url),
  );
  const claimPayment = await readOrEmpty(
    new URL('../supabase/functions/claim-payment/index.ts', import.meta.url),
  );
  const webhook = await readFile(
    new URL('../supabase/functions/icount-webhook/index.ts', import.meta.url),
    'utf8',
  );

  assert.match(migrations, /create table public\.payment_intents/i);
  assert.match(migrations, /enable row level security/i);
  assert.match(createIntent, /expected_amount/);
  assert.match(createIntent, /searchParams\.set\(["']cr["']/);
  assert.match(claimPayment, /auth\.getUser/);
  assert.match(claimPayment, /buyer_email/);
  assert.match(webhook, /payment_intents/);
  assert.match(webhook, /amount_mismatch/);
  assert.match(webhook, /ICOUNT_WEBHOOK_SECRET/);
});
