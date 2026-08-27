export function resolveInitialRecoveryStatus({
  session,
  sessionError,
  hasRecoveryContext,
  hasRecoveryRedirect,
}) {
  if (sessionError || !session) {
    return "invalid";
  }

  if (hasRecoveryContext) {
    return "ready";
  }

  if (hasRecoveryRedirect) {
    return "checking";
  }

  return "invalid";
}

export function resolveRecoveryEventStatus(event, session) {
  return event === "PASSWORD_RECOVERY" && session ? "ready" : null;
}

export async function completePasswordRecovery(auth, password) {
  const { error: updateError } = await auth.updateUser({ password });
  if (updateError) {
    return "update_error";
  }

  const { error: signOutError } = await auth.signOut({ scope: "local" });
  if (signOutError) {
    return "sign_out_error";
  }

  return "success";
}
