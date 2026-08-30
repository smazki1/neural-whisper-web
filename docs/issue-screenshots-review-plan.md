# issue-screenshots review plan

This is a separate follow-up plan. It authorizes no Storage change or deletion in the `notion-tracker` retirement pull request.

## Phase 1: Read-only inventory

1. Identify the `issue-screenshots` bucket configuration, including whether it is public, file-size limits, MIME restrictions, and applicable Storage policies.
2. List existing object metadata without downloading content: object path, MIME type, size, creation time, update time, and owner where available.
3. Identify every application, Edge Function, automation, and external URL pattern that reads or writes the bucket.
4. Preserve an inventory snapshot in an access-controlled security record. Do not include signed URLs or sensitive object contents.

## Phase 2: Sensitivity review

1. Sample files through an approved, access-controlled review process.
2. Classify each sample for personal data, authentication material, financial information, internal system details, customer content, and confidential business information.
3. Determine whether filenames or object paths themselves disclose sensitive information.
4. Document retention requirements, legal constraints, owners, and active consumers before proposing any change.

## Phase 3: Public-to-private decision

Move the bucket to private access if any sensitive content exists, public access is not a documented product requirement, or consumers can use authenticated downloads or short-lived signed URLs.

If a private transition is required:

1. Inventory and update all consumers before changing bucket visibility.
2. Define least-privilege Storage policies for approved uploaders and readers.
3. Replace public URLs with authenticated downloads or short-lived signed URLs.
4. Test access with anonymous, authenticated unauthorized, authorized user, and administrator identities.
5. Change visibility in a separately reviewed migration or controlled operations change.
6. Monitor denied requests and consumer failures during a defined observation window.
7. Keep existing objects in place. Do not delete, rename, overwrite, or bulk-copy files as part of the visibility change unless separately approved.

## Explicit exclusions

- No file deletion.
- No bucket deletion.
- No object mutation.
- No Storage policy or visibility change in the `notion-tracker` retirement pull request.
- No Production access without separate authorization and an approved review procedure.
