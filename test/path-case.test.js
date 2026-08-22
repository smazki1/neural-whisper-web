import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";

test("tracked directories do not differ only by letter case", () => {
  const trackedFiles = execFileSync("git", ["ls-files", "-z"], {
    encoding: "utf8",
  })
    .split("\0")
    .filter(Boolean);

  const spellingsByDirectory = new Map();

  for (const file of trackedFiles) {
    const segments = file.split("/");
    for (let length = 1; length < segments.length; length += 1) {
      const directory = segments.slice(0, length).join("/");
      const key = directory.toLowerCase();
      const spellings = spellingsByDirectory.get(key) ?? new Set();
      spellings.add(directory);
      spellingsByDirectory.set(key, spellings);
    }
  }

  const collisions = [...spellingsByDirectory.values()]
    .filter((spellings) => spellings.size > 1)
    .map((spellings) => [...spellings].sort().join(" <> "));

  assert.deepEqual(collisions, []);
});
