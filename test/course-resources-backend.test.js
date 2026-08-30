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

function reorderExecuteMigrationSql() {
  const candidates = readdirSync(migrationsDir)
    .filter((fileName) => fileName.endsWith("_restrict_reorder_lesson_resources_execute.sql"))
    .sort();

  assert.equal(candidates.length, 1, "expected exactly one reorder execute migration");
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
  assert.match(migration, /create policy "Public can view resources of free or preview lessons"/i);
  assert.match(migration, /c\.published = true[\s\S]*c\.is_free = true[\s\S]*l\.is_preview = true/i);
  assert.match(migration, /resources\.storage_path = storage\.objects\.name/i);
  assert.match(migration, /uca\.course_id = m\.course_id/i);
  assert.match(migration, /e\.status = 'paid'[\s\S]*p\.course_id = m\.course_id/i);
  assert.doesNotMatch(migration, /bucket_id = 'lesson-content'/i);
  assert.equal(
    migration.match(/service_role/gi)?.length,
    1,
    "service_role must appear only in the course_curriculum execute grant",
  );
});

test("resource ordering uses one authenticated RPC", () => {
  const migration = migrationSql();

  assert.match(migration, /create or replace function public\.reorder_lesson_resources/i);
  assert.match(migration, /unnest\(p_resource_ids\) with ordinality/i);
  assert.match(migration, /grant execute on function public\.reorder_lesson_resources/i);
});

test("course curriculum replacement preserves existing execute access", () => {
  const migration = migrationSql();

  assert.match(
    migration,
    /grant execute on function public\.course_curriculum\(uuid\)\s+to public, anon, authenticated, service_role;/i,
  );
  assert.doesNotMatch(
    migration,
    /revoke all on function public\.course_curriculum\(uuid\) from public;/i,
  );
});

test("course curriculum result adds only is_upcoming", () => {
  const migration = migrationSql();
  const resultContract = migration.match(
    /create function public\.course_curriculum\(p_course_id uuid\)\s+returns table\(([\s\S]*?)\)\s+language sql/i,
  );

  assert.ok(resultContract, "expected the course_curriculum result contract");
  const columns = [...resultContract[1].matchAll(/^\s*([a-z_]+)\s+[a-z]+,?$/gim)]
    .map((match) => match[1]);

  assert.deepEqual(columns, [
    "module_id",
    "module_title",
    "module_description",
    "module_position",
    "lesson_id",
    "lesson_title",
    "lesson_position",
    "duration",
    "duration_minutes",
    "is_preview",
    "is_upcoming",
  ]);
});

test("course resources migration bounds lock waits", () => {
  const migration = migrationSql();

  assert.match(migration, /^set lock_timeout = '5s';/i);
  assert.match(migration, /reset lock_timeout;\s*$/i);
});

test("reorder permission migration changes only the execute ACL", () => {
  const migration = reorderExecuteMigrationSql();

  assert.equal(
    migration.trim(),
    `set lock_timeout = '5s';

revoke execute
on function public.reorder_lesson_resources(uuid, uuid[])
from public, anon, service_role;

grant execute
on function public.reorder_lesson_resources(uuid, uuid[])
to authenticated;

reset lock_timeout;`,
  );
});
