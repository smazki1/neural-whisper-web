import assert from "node:assert/strict";
import { access, readFile, readdir, stat } from "node:fs/promises";
import test from "node:test";

const repositoryRoot = new URL("../", import.meta.url);
const retiredFunctionSlug = ["send", "contact", "form"].join("-");
const retiredFunctionDirectory = new URL(
  `supabase/functions/${retiredFunctionSlug}/`,
  repositoryRoot,
);

const activeSourceRoots = [
  "src/",
  "supabase/",
  ".github/",
  "public/",
  "index.html",
  "package.json",
  "vercel.json",
  "vite.config.ts",
];

const textFileExtensions = new Set([
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".md",
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

test("the retired contact Edge Function is absent and has no active references", async () => {
  await assert.rejects(access(retiredFunctionDirectory), { code: "ENOENT" });

  const files = (
    await Promise.all(
      activeSourceRoots.map((path) => collectTextFiles(new URL(path, repositoryRoot))),
    )
  ).flat();

  const references = [];

  for (const file of files) {
    const source = await readFile(file, "utf8");
    if (source.includes(retiredFunctionSlug)) {
      references.push(file.pathname);
    }
  }

  assert.deepEqual(references, []);
});
