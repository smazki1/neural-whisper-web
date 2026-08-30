import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

import { handler } from "../supabase/functions/notion-tracker/index.ts";

const projectRoot = process.env.PROJECT_ROOT
  ? resolve(process.env.PROJECT_ROOT)
  : resolve(new URL("..", import.meta.url).pathname);

const functionPath = resolve(
  projectRoot,
  "supabase/functions/notion-tracker/index.ts",
);
const configPath = resolve(projectRoot, "supabase/config.toml");

const read = (path) => readFile(path, "utf8");

const listSourceFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) return listSourceFiles(path);
      if (!entry.name.endsWith(".ts") || entry.name.endsWith(".test.ts")) {
        return [];
      }
      return [path];
    }),
  );
  return files.flat();
};

test("notion-tracker requires JWT verification", async () => {
  const config = await read(configPath);

  assert.match(
    config,
    /^\[functions\.notion-tracker\]\s*\nverify_jwt\s*=\s*true\s*$/m,
  );
});

test("every request reaching the tombstone receives the same 410 response", async () => {
  const originalFetch = globalThis.fetch;
  let fetchCalls = 0;
  globalThis.fetch = (() => {
    fetchCalls += 1;
    throw new Error("network access attempted");
  });

  try {
    for (const method of ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]) {
      const response = handler(
        new Request("http://localhost/notion-tracker", { method }),
      );

      assert.equal(response.status, 410);
      assert.equal(response.headers.get("Content-Type"), "application/json");
      assert.deepEqual(await response.json(), { error: "gone" });
    }
    assert.equal(fetchCalls, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("the tombstone contains no provider, secret, storage, or operation capability", async () => {
  const source = await read(functionPath);
  const forbidden = [
    ["token environment variable", /NOTION_TOKEN/i],
    ["provider API", /api\.notion\.com/i],
    ["service role", /SUPABASE_SERVICE_ROLE_KEY/i],
    ["network request", /\bfetch\s*\(/],
    ["environment access", /\b(?:Deno|process)\s*\.\s*env\b/],
    ["Supabase client", /\bcreateClient\s*\(|@supabase\/supabase-js/i],
    ["Storage access", /storage(?:\/v1|\s*\.)|\.(?:upload|remove)\s*\(/i],
    ["retired operation", /\b(?:list|create|update|appendLog|uploadScreenshot)\b/i],
    ["request body read", /\b_request\s*\.\s*(?:arrayBuffer|blob|body|formData|json|text)\b/],
    ["logging", /\bconsole\s*\./],
  ];

  for (const [name, pattern] of forbidden) {
    assert.doesNotMatch(source, pattern, `${name} is forbidden`);
  }
});

test("Edge Function source cannot contain a hardcoded Notion token", async () => {
  const sourceFiles = await listSourceFiles(
    resolve(projectRoot, "supabase/functions"),
  );
  const tokenPatterns = [
    /\bNOTION_TOKEN\b/i,
    /\b(?:secret|ntn)_[A-Za-z0-9_-]{20,}\b/,
  ];

  for (const path of sourceFiles) {
    const source = await read(path);
    for (const pattern of tokenPatterns) {
      assert.doesNotMatch(source, pattern, `forbidden token material in ${path}`);
    }
  }
});
