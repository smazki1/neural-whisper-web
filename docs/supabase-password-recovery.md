# Supabase Auth password recovery

Password reset is implemented exclusively through the official Supabase Auth recovery flow. The frontend requests recovery emails with `auth.resetPasswordForEmail`, and completes recovery with `auth.updateUser`. The legacy custom `password-reset` Edge Function is no longer part of this repository.

## Redirect URLs required before deployment

Add these exact URLs in Supabase Dashboard, Authentication, URL Configuration, Redirect URLs:

- `https://ai-master.co.il/update-password`
- `https://www.ai-master.co.il/update-password`

Do not add a wildcard redirect.

Before deploying the frontend, also verify these existing Supabase Auth settings without changing them as part of this code change:

- The production email provider or custom SMTP configuration can deliver recovery emails.
- The Recovery email template links through `{{ .ConfirmationURL }}` so Supabase can honor the exact `redirectTo` value.
- The Site URL remains the approved production site URL.

## Preview URL

No Preview URL is configured by this change. If Preview testing is required, add its exact `/update-password` URL as a separate Redirect URL only after the Preview hostname is known and approved. Do not use a wildcard.

## Manual verification

1. Request a reset for an existing test account at `/reset-password`.
2. Confirm that the page always displays: `אם כתובת המייל קיימת במערכת, נשלח אליה קישור לאיפוס הסיסמה.`
3. Open the Supabase recovery email and confirm it routes to `/update-password` without leaving tokens in the address bar.
4. Confirm that opening `/update-password` directly shows the invalid or expired link state.
5. Confirm that a password shorter than eight characters is rejected.
6. Confirm that passwords without an uppercase letter, lowercase letter, or number are rejected.
7. Confirm that different password and confirmation values are rejected.
8. Submit a valid password and confirm the recovery session ends and the browser returns to `/auth`.
9. Sign in with the new password.
10. Open a legacy `/reset-password/:token` URL and confirm it only links to `/reset-password`.

## Rollback

Revert the legacy-function removal commit to restore its source and local configuration. The production `password-reset` Edge Function and the `password_resets` table are not changed by this removal, so no database rollback is required. The official Supabase Auth recovery flow remains the active frontend implementation.
