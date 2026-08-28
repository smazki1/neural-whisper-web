import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readOrEmpty = (url) => readFile(url, "utf8").catch(() => "");

test("resetPasswordForEmail returned errors are handled without account disclosure", async () => {
  const page = await readOrEmpty(
    new URL("../src/pages/ResetPassword.tsx", import.meta.url),
  );
  const helperUrl = new URL("../src/lib/passwordResetRequest.js", import.meta.url);
  const helperSource = await readOrEmpty(helperUrl);

  assert.match(helperSource, /export async function requestPasswordReset/);
  assert.match(page, /const\s+\{\s*error\s*\}\s*=\s*await\s+requestPasswordReset/);
  assert.match(page, /if\s*\(error\)/);
  assert.doesNotMatch(page, /error\.message/);
  assert.doesNotMatch(page, /console\.(?:log|error|warn)\([^)]*(?:email|token|session)/i);

  const { requestPasswordReset } = await import(helperUrl);
  const returnedError = new Error("provider rejected request");
  const auth = {
    async resetPasswordForEmail() {
      return { data: {}, error: returnedError };
    },
  };

  const result = await requestPasswordReset(
    auth,
    "private@example.com",
    "https://example.com/update-password",
  );

  assert.equal(result.error, returnedError);
});

test("PASSWORD_RECOVERY before mount restores the recovery form", async () => {
  const flowUrl = new URL("../src/lib/passwordRecoveryFlow.js", import.meta.url);
  const flowSource = await readOrEmpty(flowUrl);
  assert.match(flowSource, /export function resolveInitialRecoveryStatus/);

  const { resolveInitialRecoveryStatus } = await import(flowUrl);
  const session = { user: { id: "user-1" } };

  assert.equal(
    resolveInitialRecoveryStatus({
      session,
      sessionError: null,
      hasRecoveryContext: true,
      hasRecoveryRedirect: false,
    }),
    "ready",
  );
});

test("PASSWORD_RECOVERY after mount changes checking state to ready", async () => {
  const flowUrl = new URL("../src/lib/passwordRecoveryFlow.js", import.meta.url);
  const flowSource = await readOrEmpty(flowUrl);
  assert.match(flowSource, /export function resolveRecoveryEventStatus/);

  const { resolveInitialRecoveryStatus, resolveRecoveryEventStatus } = await import(flowUrl);
  const session = { user: { id: "user-1" } };

  assert.equal(
    resolveInitialRecoveryStatus({
      session,
      sessionError: null,
      hasRecoveryContext: false,
      hasRecoveryRedirect: true,
    }),
    "checking",
  );
  assert.equal(resolveRecoveryEventStatus("PASSWORD_RECOVERY", session), "ready");
});

test("a regular signed-in session is not accepted as password recovery", async () => {
  const flowUrl = new URL("../src/lib/passwordRecoveryFlow.js", import.meta.url);
  const flowSource = await readOrEmpty(flowUrl);
  assert.match(flowSource, /export function resolveInitialRecoveryStatus/);

  const { resolveInitialRecoveryStatus } = await import(flowUrl);

  assert.equal(
    resolveInitialRecoveryStatus({
      session: { user: { id: "user-1" } },
      sessionError: null,
      hasRecoveryContext: false,
      hasRecoveryRedirect: false,
    }),
    "invalid",
  );
});

test("a missing or expired recovery link resolves to invalid", async () => {
  const flowUrl = new URL("../src/lib/passwordRecoveryFlow.js", import.meta.url);
  const flowSource = await readOrEmpty(flowUrl);
  assert.match(flowSource, /export function resolveInitialRecoveryStatus/);

  const { resolveInitialRecoveryStatus } = await import(flowUrl);

  assert.equal(
    resolveInitialRecoveryStatus({
      session: null,
      sessionError: null,
      hasRecoveryContext: false,
      hasRecoveryRedirect: false,
    }),
    "invalid",
  );
  assert.equal(
    resolveInitialRecoveryStatus({
      session: null,
      sessionError: new Error("expired"),
      hasRecoveryContext: false,
      hasRecoveryRedirect: true,
    }),
    "invalid",
  );
});

test("recovery redirect detection records intent without retaining tokens", async () => {
  const intentUrl = new URL("../src/lib/authRedirectIntent.js", import.meta.url);
  const intentSource = await readOrEmpty(intentUrl);
  assert.match(intentSource, /export function detectPasswordRecoveryRedirect/);

  const { detectPasswordRecoveryRedirect } = await import(intentUrl);
  const recoveryUrl =
    "https://example.com/update-password#access_token=secret-access&refresh_token=secret-refresh&type=recovery";

  assert.equal(detectPasswordRecoveryRedirect(recoveryUrl), true);
  assert.equal(detectPasswordRecoveryRedirect("https://example.com/update-password"), false);
  assert.equal(
    detectPasswordRecoveryRedirect("https://example.com/update-password?type=recovery"),
    false,
  );
  assert.doesNotMatch(intentSource, /localStorage\.setItem|sessionStorage\.setItem/);
});

test("recovery redirect intent is captured before the application imports Supabase", async () => {
  const main = await readOrEmpty(new URL("../src/main.tsx", import.meta.url));

  assert.match(main, /import [^;]*authRedirectIntent\.js/);
  assert.ok(
    main.indexOf("authRedirectIntent.js") < main.indexOf("./App.tsx"),
  );
});

test("the initial recovery redirect intent is consumed after Auth initialization", async () => {
  const intent = await readOrEmpty(
    new URL("../src/lib/authRedirectIntent.js", import.meta.url),
  );
  const page = await readOrEmpty(
    new URL("../src/pages/UpdatePassword.tsx", import.meta.url),
  );

  assert.match(intent, /export function consumeInitialPasswordRecoveryRedirect/);
  assert.match(page, /consumeInitialPasswordRecoveryRedirect\(\)/);
});

test("updateUser errors stop before signOut", async () => {
  const flowUrl = new URL("../src/lib/passwordRecoveryFlow.js", import.meta.url);
  const flowSource = await readOrEmpty(flowUrl);
  assert.match(flowSource, /export async function completePasswordRecovery/);

  const { completePasswordRecovery } = await import(flowUrl);
  let signOutCalls = 0;
  const auth = {
    async updateUser() {
      return { error: new Error("update failed") };
    },
    async signOut() {
      signOutCalls += 1;
      return { error: null };
    },
  };

  assert.equal(await completePasswordRecovery(auth, "StrongPass1"), "update_error");
  assert.equal(signOutCalls, 0);
});

test("signOut errors are reported after a successful password update", async () => {
  const flowUrl = new URL("../src/lib/passwordRecoveryFlow.js", import.meta.url);
  const flowSource = await readOrEmpty(flowUrl);
  assert.match(flowSource, /export async function completePasswordRecovery/);

  const { completePasswordRecovery } = await import(flowUrl);
  const auth = {
    async updateUser() {
      return { error: null };
    },
    async signOut() {
      return { error: new Error("sign out failed") };
    },
  };

  assert.equal(await completePasswordRecovery(auth, "StrongPass1"), "sign_out_error");
});

test("successful recovery updates the password and ends only the local session", async () => {
  const flowUrl = new URL("../src/lib/passwordRecoveryFlow.js", import.meta.url);
  const flowSource = await readOrEmpty(flowUrl);
  assert.match(flowSource, /export async function completePasswordRecovery/);

  const { completePasswordRecovery } = await import(flowUrl);
  const calls = [];
  const auth = {
    async updateUser(payload) {
      calls.push(["updateUser", payload]);
      return { error: null };
    },
    async signOut(options) {
      calls.push(["signOut", options]);
      return { error: null };
    },
  };

  assert.equal(await completePasswordRecovery(auth, "StrongPass1"), "success");
  assert.deepEqual(calls, [
    ["updateUser", { password: "StrongPass1" }],
    ["signOut", { scope: "local" }],
  ]);
});

test("UpdatePassword has no arbitrary recovery timeout and cleans URL after getSession", async () => {
  const page = await readOrEmpty(
    new URL("../src/pages/UpdatePassword.tsx", import.meta.url),
  );

  assert.doesNotMatch(page, /setTimeout|250/);
  assert.match(page, /await supabase\.auth\.getSession\(\)/);
  assert.match(
    page,
    /await supabase\.auth\.getSession\(\);\s*clearAuthCallbackUrl\(\)/,
  );
});
