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
const fixture = read("supabase/tests/fixtures/grant_course_access_schema.fixture");

test("grant-course-access requires JWT verification and no service role", () => {
  assert.match(config, /\[functions\.grant-course-access\]\s+verify_jwt = true/);
  const configWithoutProtectedSections = config
    .replace(
      /\n\[functions\.create-icount-payment\]\nverify_jwt = true\n/,
      "\n[functions.create-icount-payment]\nverify_jwt = false\n",
    )
    .replace(
      /\n\[functions\.grant-course-access\]\nverify_jwt = true\n/,
      "",
    )
    .replace(
      /\n\[functions\.send-consultation-email\]\nverify_jwt = true\n/,
      "",
    )
    .replace(
      /\n\[functions\.notion-tracker\]\nverify_jwt = true\n$/,
      "",
    );
  assert.equal(
    hashText(configWithoutProtectedSections),
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
  assert.equal(
    functionSource.match(/\.insert\(/g)?.length,
    1,
    "course access must use one bulk insert call",
  );
  assert.match(functionSource, /new Set\(productCourses\.map/);
  assert.match(functionSource, /\.in\("course_id", courseIds\)/);
  assert.match(functionSource, /\.insert\(missingAccess\)/);
  assert.match(functionSource, /insertError\.code !== "23505"/);
  assert.match(functionSource, /const retryError = await insertMissingAccess\(missingAccess\)/);
  assert.match(functionSource, /const remainingAccess = await readMissingAccess\(\)/);
  assert.doesNotMatch(functionSource, /isExactAccess/);
  assert.match(functionSource, /return jsonResponse\(500, \{ error: "Internal server error" \}\)/);
});

test("the replacement policy binds user, order, status, product, and mapped course", () => {
  assert.match(migration, /drop policy if exists "Users can create their own orders"\s+on public\.orders/i);
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
  assert.match(fixture, /create policy "Users can create their own orders"/i);
  assert.match(fixture, /grant insert on public\.orders to authenticated/i);
});

test("the unrelated iCount webhook remains byte-for-byte unchanged", () => {
  assert.equal(hash("supabase/functions/icount-webhook/index.ts"), "5e93065450f40f95af8ac9d060130c236e2e906c13104048818f95de3383370e");
});
