export async function requestPasswordReset(auth, email, options) {
  return auth.resetPasswordForEmail(email, options);
}
