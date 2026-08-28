import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

const readOrEmpty = (url) => readFile(url, "utf8").catch(() => "");

async function readFrontendSources(directoryUrl) {
  const entries = await readdir(directoryUrl, { withFileTypes: true });
  const sources = await Promise.all(
    entries.map(async (entry) => {
      const entryUrl = new URL(`${entry.name}${entry.isDirectory() ? "/" : ""}`, directoryUrl);

      if (entry.isDirectory()) {
        return readFrontendSources(entryUrl);
      }

      if (!/\.(?:ts|tsx|js|jsx)$/.test(entry.name)) {
        return "";
      }

      return readFile(entryUrl, "utf8");
    }),
  );

  return sources.flat(Infinity).join("\n");
}

test("password reset requests use Supabase Auth and a non-enumerating response", async () => {
  const source = await readOrEmpty(
    new URL("../src/pages/ResetPassword.tsx", import.meta.url),
  );
  const requestHelper = await readOrEmpty(
    new URL("../src/lib/passwordResetRequest.js", import.meta.url),
  );

  assert.match(source, /const\s+\{\s*error\s*\}\s*=\s*await\s+requestPasswordReset/);
  assert.match(source, /if\s*\(error\)/);
  assert.match(requestHelper, /auth\.resetPasswordForEmail\(email,/);
  assert.match(
    source,
    /redirectTo:\s*`\$\{window\.location\.origin\}\/update-password`/,
  );
  assert.match(
    source,
    /אם כתובת המייל קיימת במערכת, נשלח אליה קישור לאיפוס הסיסמה\./,
  );
  assert.doesNotMatch(source, /error\.message/);
});

test("the frontend no longer invokes the custom password-reset Edge Function", async () => {
  const frontend = await readFrontendSources(new URL("../src/", import.meta.url));

  assert.doesNotMatch(
    frontend,
    /functions\s*\.\s*invoke\s*\(\s*["']password-reset["']/,
  );
});

test("the update-password route uses a valid recovery session", async () => {
  const app = await readOrEmpty(new URL("../src/App.tsx", import.meta.url));
  const page = await readOrEmpty(
    new URL("../src/pages/UpdatePassword.tsx", import.meta.url),
  );
  const flow = await readOrEmpty(
    new URL("../src/lib/passwordRecoveryFlow.js", import.meta.url),
  );

  assert.match(app, /path=["']\/update-password["']/);
  assert.match(page, /onAuthStateChange/);
  assert.match(page, /resolveRecoveryEventStatus\(event, session\)/);
  assert.match(flow, /event\s*===\s*["']PASSWORD_RECOVERY["']/);
  assert.match(page, /auth\.getSession\(\)/);
  assert.match(page, /hasValidPasswordRecoveryContext/);
  assert.match(page, /קישור האיפוס חסר, פג תוקף או אינו תקין/);
});

test("password policy rejects weak and mismatched passwords", async () => {
  const helperUrl = new URL("../src/lib/passwordValidation.js", import.meta.url);
  const source = await readOrEmpty(helperUrl);

  assert.match(source, /export function validatePasswordChange/);

  const { validatePasswordChange } = await import(helperUrl);

  assert.equal(validatePasswordChange("Short1", "Short1"), "too_short");
  assert.equal(validatePasswordChange("lowercase1", "lowercase1"), "missing_uppercase");
  assert.equal(validatePasswordChange("UPPERCASE1", "UPPERCASE1"), "missing_lowercase");
  assert.equal(validatePasswordChange("NoNumberHere", "NoNumberHere"), "missing_number");
  assert.equal(validatePasswordChange("StrongPass1", "StrongPass2"), "mismatch");
  assert.equal(validatePasswordChange("StrongPass1", "StrongPass1"), null);
});

test("a valid password is updated and the recovery session is ended locally", async () => {
  const source = await readOrEmpty(
    new URL("../src/pages/UpdatePassword.tsx", import.meta.url),
  );
  const flow = await readOrEmpty(
    new URL("../src/lib/passwordRecoveryFlow.js", import.meta.url),
  );

  assert.match(source, /completePasswordRecovery\(supabase\.auth, password\)/);
  assert.match(flow, /auth\.updateUser\(\{\s*password\s*\}\)/);
  assert.match(flow, /auth\.signOut\(\{\s*scope:\s*["']local["']\s*\}\)/);
  assert.match(source, /navigate\(["']\/auth["'],\s*\{\s*replace:\s*true\s*\}\)/);
});

test("the legacy token route only directs users to request a new link", async () => {
  const source = await readOrEmpty(
    new URL("../src/pages/ResetPasswordConfirm.tsx", import.meta.url),
  );

  assert.doesNotMatch(source, /supabase/);
  assert.doesNotMatch(source, /functions\.invoke/);
  assert.match(source, /הקישור הישן אינו תקף/);
  assert.match(source, /to=["']\/reset-password["']/);
});

test("login remains wired to Supabase password authentication", async () => {
  const authPage = await readOrEmpty(new URL("../src/pages/Auth.tsx", import.meta.url));
  const authHook = await readOrEmpty(new URL("../src/hooks/useAuth.tsx", import.meta.url));

  assert.match(authPage, /await signIn\(email, password\)/);
  assert.match(authHook, /supabase\.auth\.signInWithPassword\(\{ email, password \}\)/);
});

test("Supabase redirect documentation lists only exact production URLs", async () => {
  const source = await readOrEmpty(
    new URL("../docs/supabase-password-recovery.md", import.meta.url),
  );

  assert.match(source, /https:\/\/ai-master\.co\.il\/update-password/);
  assert.match(source, /https:\/\/www\.ai-master\.co\.il\/update-password/);
  assert.doesNotMatch(source, /https:\/\/\*\./);
  assert.match(source, /Preview/);
});
