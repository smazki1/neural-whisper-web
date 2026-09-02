import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const config = await readFile(new URL('../supabase/config.toml', import.meta.url), 'utf8');
const projectId = config.match(/^project_id\s*=\s*"([^"]+)"/m)?.[1];
assert.ok(projectId, 'Supabase project_id is missing from config.toml');

const containerName = `supabase_db_${projectId}`;

const runPsql = async (sql) => {
  const { stdout } = await execFileAsync('docker', [
    'exec',
    '-i',
    containerName,
    'psql',
    '-XqAt',
    '-v',
    'ON_ERROR_STOP=1',
    '-U',
    'postgres',
    '-d',
    'postgres',
    '-c',
    sql,
  ]);
  return stdout.trim();
};

const cleanup = `
  delete from public.entitlements where user_id = '10000000-0000-0000-0000-000000000109';
  delete from public.payment_intents where id = '30000000-0000-0000-0000-000000000109';
  delete from public.products where id = '20000000-0000-0000-0000-000000000109';
  delete from auth.users where id = '10000000-0000-0000-0000-000000000109';
`;

test('parallel payment claims return consistently and create one entitlement', { timeout: 30_000 }, async () => {
  await runPsql(cleanup);

  try {
    await runPsql(`
      insert into auth.users (id, email)
      values ('10000000-0000-0000-0000-000000000109', 'concurrent@example.test');
      insert into public.products (id, title, slug, price, product_type, is_published)
      values ('20000000-0000-0000-0000-000000000109', 'Concurrent claim product', 'concurrent-claim-product', 100, 'course', true);
      insert into public.payment_intents (id, product_id, status, expected_amount, amount_paid, buyer_email)
      values ('30000000-0000-0000-0000-000000000109', '20000000-0000-0000-0000-000000000109', 'paid', 100, 100, 'concurrent@example.test');
    `);

    const claim = `
      set role service_role;
      select public.claim_payment_transaction(
        '30000000-0000-0000-0000-000000000109',
        '10000000-0000-0000-0000-000000000109',
        'concurrent@example.test'
      )::text;
    `;
    const outcomes = await Promise.allSettled([runPsql(claim), runPsql(claim)]);
    const rejected = outcomes.find((outcome) => outcome.status === 'rejected');
    if (rejected) throw rejected.reason;

    const results = outcomes.map((outcome) => JSON.parse(outcome.value));
    assert.deepEqual(results[0], results[1]);
    assert.equal(results[0].status, 'claimed');

    const finalState = await runPsql(`
      select concat_ws('|',
        (select count(*) from public.entitlements
         where user_id = '10000000-0000-0000-0000-000000000109'
           and product_id = '20000000-0000-0000-0000-000000000109'),
        (select status from public.payment_intents
         where id = '30000000-0000-0000-0000-000000000109'),
        (select claimed_by = '10000000-0000-0000-0000-000000000109'::uuid
         from public.payment_intents
         where id = '30000000-0000-0000-0000-000000000109')
      );
    `);
    assert.equal(finalState, '1|claimed|t');
  } finally {
    await runPsql(cleanup);
  }
});
