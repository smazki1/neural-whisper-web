import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const migrationsDir = resolve(root, "supabase/migrations");

function migrationSql() {
  const candidates = readdirSync(migrationsDir)
    .filter((fileName) => fileName.endsWith("_course_resources.sql"))
    .sort();

  assert.equal(candidates.length, 1, "expected exactly one course resources migration");
  return readFileSync(resolve(migrationsDir, candidates[0]), "utf8");
}

test("resource schema separates external links from stored files", () => {
  const migration = migrationSql();

  assert.match(migration, /alter type public\.resource_type add value if not exists 'file'/i);
  assert.match(migration, /alter column url drop not null/i);

  for (const column of ["storage_path", "position", "file_name", "mime_type", "size_bytes"]) {
    assert.match(migration, new RegExp(`add column if not exists ${column}`, "i"));
  }

  assert.match(migration, /resources_source_check/i);
  assert.match(migration, /add column if not exists is_upcoming boolean not null default false/i);
  assert.match(migration, /course_curriculum[\s\S]*is_upcoming boolean/i);
});

test("resource access is private and exact-course", () => {
  const migration = migrationSql();

  assert.match(migration, /'course-resources'[\s\S]*false[\s\S]*26214400/i);
  assert.match(migration, /drop policy if exists "Public can view resources of free or preview lessons"/i);
  assert.match(migration, /resources\.storage_path = storage\.objects\.name/i);
  assert.match(migration, /uca\.course_id = m\.course_id/i);
  assert.match(migration, /e\.status = 'paid'[\s\S]*p\.course_id = m\.course_id/i);
  assert.doesNotMatch(migration, /bucket_id = 'lesson-content'/i);
  assert.doesNotMatch(migration, /service_role/i);
});

test("resource ordering uses one authenticated RPC", () => {
  const migration = migrationSql();

  assert.match(migration, /create or replace function public\.reorder_lesson_resources/i);
  assert.match(migration, /unnest\(p_resource_ids\) with ordinality/i);
  assert.match(migration, /grant execute on function public\.reorder_lesson_resources/i);
});
