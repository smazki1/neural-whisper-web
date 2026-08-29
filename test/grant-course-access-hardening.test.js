import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const projectRoot = process.env.PROJECT_ROOT
  ? resolve(process.env.PROJECT_ROOT)
  : resolve(new URL("..", import.meta.url).pathname);
const read = (path) => readFileSync(resolve(projectRoot, path), "utf8");
const hashText = (value) => createHash("sha256").update(value).digest("hex");
const hash = (path) => hashText(read(path));

const functionSource = read("supabase/functions/grant-course-access/index.ts");
const config = read("supabase/config.toml");
const migration = read("supabase/migrations/20260829173000_harden_grant_course_access.sql");
const fixture = read("supabase/tests/fixtures/grant_course_access_schema.sql");

test("grant-course-access requires JWT verification and no service role", () => {
  assert.match(config, /\[functions\.grant-course-access\]\s+verify_jwt = true/);
  const configWithoutGrant = config.replace(
    /\n\[functions\.grant-course-access\]\nverify_jwt = true\n$/,
    "",
  );
  assert.equal(
    hashText(configWithoutGrant),
    "bda070365b35999aa105b2f4ed414f37b37a5a9211f55bc536eec4aee2fdd7fb",
    "another Edge Function config changed",
  );
  assert.doesNotMatch(functionSource, /SUPABASE_SERVICE_ROLE_KEY/);
  assert.match(functionSource, /Deno\.env\.get\("SUPABASE_ANON_KEY"\)/);
  assert.match(functionSource, /req\.headers\.get\("Authorization"\)/);
  assert.match(functionSource, /auth\.getUser\(\s*bearerMatch\[1\]/);
});

test("grant-course-access enforces its request and order contract", () => {
  assert.match(functionSource, /req\.method !== "POST"/);
  assert.match(functionSource, /status: 204/);
  assert.match(functionSource, /jsonResponse\(405/);
  assert.match(functionSource, /uuidPattern\.test\(orderId\)/);
  assert.match(functionSource, /\.eq\("id", orderId\)[\s\S]*\.eq\("user_id", user\.id\)[\s\S]*\.eq\("status", "completed"\)/);
  assert.match(functionSource, /\.from\("products_courses"\)/);
  assert.match(functionSource, /\.from\("user_course_access"\)[\s\S]*\.insert\(/);
});

test("grant-course-access preserves replay audit and checks write failures", () => {
  assert.doesNotMatch(functionSource, /\.upsert\(/);
  assert.doesNotMatch(functionSource, /granted_at\s*:/);
  assert.match(functionSource, /insertError\.code !== "23505"/);
  assert.match(functionSource, /existingAccessError \|\| !existingAccess/);
  assert.match(functionSource, /return jsonResponse\(500, \{ error: "Internal server error" \}\)/);
});

test("the replacement policy binds user, order, status, product, and mapped course", () => {
  assert.match(migration, /drop policy if exists "Users can insert own course access via paid order"/i);
  assert.match(migration, /for insert\s+to authenticated\s+with check/i);
  assert.match(migration, /auth\.uid\(\)\) = user_course_access\.user_id/);
  assert.match(migration, /o\.id = user_course_access\.order_id/);
  assert.match(migration, /o\.user_id = \(select auth\.uid\(\)\)/);
  assert.match(migration, /o\.status = 'completed'::public\.order_status/);
  assert.match(migration, /o\.product_id = user_course_access\.product_id/);
  assert.match(migration, /pc\.product_id = o\.product_id/);
  assert.match(migration, /pc\.course_id = user_course_access\.course_id/);
  assert.doesNotMatch(migration, /entitlements|Admins can insert course access/i);
});

test("the isolated RLS fixture contains no destructive schema operation", () => {
  assert.doesNotMatch(fixture, /drop\s+(schema|database)/i);
  assert.match(fixture, /disposable local database only/i);
});

test("payment functions remain byte-for-byte unchanged", () => {
  assert.equal(hash("supabase/functions/create-icount-payment/index.ts"), "a35cca259bcfd4fff8164e2c93d01757c0cb49b5d05657f98888720d3f085d3c");
  assert.equal(hash("supabase/functions/icount-webhook/index.ts"), "15ebf7ba61fcb904ea1a8fe34cac316e142715a6e48b427e52bef75fc677a1a0");
  assert.equal(hash("supabase/functions/create-payment-intent/index.ts"), "e45d278d867b72ad12f8bc9bb7dffc55ad1edb066b4013d501d18702c79f26ce");
  assert.equal(hash("supabase/functions/claim-payment/index.ts"), "603af3d96e4a3cd24a6f994c3e066bc56865845594f793eaf97df65d700b105f");
});
