import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import test from 'node:test';

const readOrEmpty = async (path) => readFile(new URL(path, import.meta.url), 'utf8').catch(() => '');
const importOrNull = async (path) => import(new URL(path, import.meta.url)).catch(() => null);

test('public product purchases use the canonical vault destination', async () => {
  const destinationModule = await importOrNull('../src/lib/purchaseDestination.js');
  assert.ok(destinationModule, 'purchase destination helper is missing');
  const { getVaultPurchaseUrl } = destinationModule;
  assert.equal(
    getVaultPurchaseUrl({ slug: 'ai-for-business', product_type: 'course' }),
    'https://vault.ai-master.co.il/courses/ai-for-business',
  );
  assert.equal(
    getVaultPurchaseUrl({ slug: 'prompt-pack', product_type: 'prompt_pack' }),
    'https://vault.ai-master.co.il/prompts/packs/prompt-pack',
  );
  assert.equal(
    getVaultPurchaseUrl({ slug: 'workshop', product_type: 'workshop' }),
    'https://vault.ai-master.co.il/store/workshop',
  );

  const productDetail = await readOrEmpty('../src/pages/ProductDetail.tsx');
  const app = await readOrEmpty('../src/App.tsx');
  assert.match(productDetail, /getVaultPurchaseUrl/);
  assert.match(productDetail, /window\.location\.assign/);
  assert.doesNotMatch(productDetail, /navigate\(['"]\/auth['"]\)/);
  assert.doesNotMatch(productDetail, /navigate\(`\/checkout/);
  assert.doesNotMatch(productDetail, /נדרשת התחברות לרכישה|!user/);
  assert.doesNotMatch(app, /pages\/Checkout|path=["']\/checkout\/|<Checkout/);
});

test('legacy payment creation is a JWT-protected tombstone', async () => {
  const source = await readOrEmpty('../supabase/functions/create-icount-payment/index.ts');
  const config = await readOrEmpty('../supabase/config.toml');

  assert.match(config, /\[functions\.create-icount-payment\]\s+verify_jwt = true/);
  assert.match(source, /status:\s*410/);
  assert.match(source, /gone/);
  assert.doesNotMatch(source, /SERVICE_ROLE|ICOUNT_API_TOKEN|\.from\(['"]orders['"]\)|api\.icount\.co\.il/);
});

test('guest payment intents are origin-bound, rate-limited, and cleaned up', async () => {
  const source = await readOrEmpty('../supabase/functions/create-payment-intent/index.ts');
  const migrationFiles = await readdir(new URL('../supabase/migrations/', import.meta.url));
  const migrations = (
    await Promise.all(migrationFiles.map((name) => readFile(new URL(`../supabase/migrations/${name}`, import.meta.url), 'utf8')))
  ).join('\n');

  assert.doesNotMatch(source, /Access-Control-Allow-Origin["']:\s*["']\*["']/);
  assert.match(source, /vault\.ai-master\.co\.il/);
  assert.match(source, /https:\/\/www\.ai-master\.co\.il/);
  assert.match(source, /await req\.text\(\)/);
  assert.match(source, /TextEncoder[\s\S]*byteLength|byteLength[\s\S]*1024/);
  assert.match(source, /request_fingerprint/);
  assert.match(source, /rate_limited[\s\S]*429/);
  assert.match(source, /create_payment_intent_limited/);
  assert.match(migrations, /add column if not exists request_fingerprint text/i);
  assert.match(migrations, /payment_intents_request_fingerprint_created_at_idx/i);
  assert.match(migrations, /pg_advisory_xact_lock/i);
  assert.match(migrations, /create or replace function public\.create_payment_intent_limited/i);
  assert.match(migrations, /revoke all on function public\.create_payment_intent_limited[\s\S]*from public, anon, authenticated/i);
  assert.match(migrations, /grant execute on function public\.create_payment_intent_limited[\s\S]*to service_role/i);
});

test('product copy contains no raw markup or unverified hard-coded social proof', async () => {
  const descriptionModule = await importOrNull('../src/lib/productDescription.js');
  assert.ok(descriptionModule, 'product description helper is missing');
  const { productDescriptionParagraphs } = descriptionModule;
  assert.deepEqual(
    productDescriptionParagraphs('<p>פסקה ראשונה</p><p>פסקה &amp; שנייה<br>שורה נוספת</p>'),
    ['פסקה ראשונה', 'פסקה & שנייה\nשורה נוספת'],
  );

  const productDetail = await readOrEmpty('../src/pages/ProductDetail.tsx');
  assert.match(productDetail, /productDescriptionParagraphs/);
  assert.doesNotMatch(productDetail, /4\.8 \(123 ביקורות\)|שרה כהן|דני לוי|מיכל אברמוביץ/);
});
