import assert from "node:assert/strict";
import { access, readFile, readdir, stat } from "node:fs/promises";
import test from "node:test";

const repositoryRoot = new URL("../", import.meta.url);
const retiredFunctionSlug = ["backup", "system"].join("-");
const retiredFunctionId = [
  "63617dd9",
  "cfee",
  "412f",
  "a3aa",
  "9f7e880c0da5",
].join("-");
const retiredFunctionPath = ["", "functions", "v1", retiredFunctionSlug].join("/");
const retiredFunctionDirectory = new URL(
  `supabase/functions/${retiredFunctionSlug}/`,
  repositoryRoot,
);

const activeSourceRoots = [
  "src/",
  "supabase/",
  ".github/",
  "public/",
  "scripts/",
  "api/",
  "index.html",
  "package.json",
  "package-lock.json",
  "vercel.json",
  "vite.config.ts",
  "vite.config.js",
  "netlify.toml",
  "wrangler.toml",
  "Dockerfile",
];

const textFileExtensions = new Set([
  "",
  ".cjs",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".mjs",
  ".sh",
  ".sql",
  ".toml",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml",
]);

const extensionOf = (name) => {
  const dotIndex = name.lastIndexOf(".");
  return dotIndex === -1 ? "" : name.slice(dotIndex);
};

const collectTextFiles = async (url) => {
  let metadata;

  try {
    metadata = await stat(url);
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }

  if (metadata.isFile()) {
    return textFileExtensions.has(extensionOf(url.pathname)) ? [url] : [];
  }

  const entries = await readdir(url, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) =>
      collectTextFiles(new URL(`${entry.name}${entry.isDirectory() ? "/" : ""}`, url)),
    ),
  );

  return files.flat();
};

test("the retired backup Edge Function is absent and has no active references", async () => {
  await assert.rejects(access(retiredFunctionDirectory), { code: "ENOENT" });

  const files = (
    await Promise.all(
      activeSourceRoots.map((path) => collectTextFiles(new URL(path, repositoryRoot))),
    )
  ).flat();
  const forbiddenReferences = [
    retiredFunctionSlug,
    retiredFunctionPath,
    retiredFunctionId,
  ];
  const references = [];

  for (const file of files) {
    const source = await readFile(file, "utf8");
    if (forbiddenReferences.some((reference) => source.includes(reference))) {
      references.push(file.pathname);
    }
  }

  assert.deepEqual(references, []);
});
