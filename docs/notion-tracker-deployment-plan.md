# notion-tracker deployment and credential retirement

This runbook is executed only after the pull request is reviewed and merged. It is not part of this pull request's execution.

## Preconditions

1. Confirm the pull request CI is green and the approved commit is present on `main`.
2. Confirm the operator has permission to deploy one Supabase Edge Function and to revoke the affected Notion integration credential.
3. Keep the old credential only in an ephemeral, hidden shell variable. Do not paste it into a command, file, ticket, log, pull request, or chat.
4. Obtain a valid low-privilege user JWT for the post-deployment authenticated check. Do not use a service-role credential.

## Deploy only the tombstone

```bash
export SUPABASE_PROJECT_REF='<approved-project-ref>'
supabase functions deploy notion-tracker --project-ref "$SUPABASE_PROJECT_REF"
```

Do not run a bulk function deployment. Do not deploy or modify any other Edge Function.

## Verify gateway and tombstone behavior

An unauthenticated request must be rejected by the Supabase gateway before the function runs:

```bash
curl --silent --show-error --output /dev/null --write-out '%{http_code}\n' \
  "https://${SUPABASE_PROJECT_REF}.supabase.co/functions/v1/notion-tracker"
```

Expected status: `401`.

Read the publishable key and a valid user JWT without echoing them or placing them in shell history:

```bash
read -rs SUPABASE_PUBLISHABLE_KEY
read -rs SUPABASE_USER_JWT
curl --silent --show-error --output /tmp/notion-tracker-response.json \
  --write-out '%{http_code}\n' \
  --header "apikey: ${SUPABASE_PUBLISHABLE_KEY}" \
  --header "Authorization: Bearer ${SUPABASE_USER_JWT}" \
  "https://${SUPABASE_PROJECT_REF}.supabase.co/functions/v1/notion-tracker"
test "$(tr -d '\n' < /tmp/notion-tracker-response.json)" = '{"error":"gone"}'
unset SUPABASE_PUBLISHABLE_KEY SUPABASE_USER_JWT
```

Expected status: `410`. Expected body: `{"error":"gone"}`. Remove the temporary response file after verification. It contains no credential or internal detail.

## Revoke the old Notion credential

1. Before revocation, load the old credential into an ephemeral variable using `read -rs OLD_NOTION_TOKEN`. Never echo it.
2. In the owning Notion workspace, open `Settings`, then `Connections`, then the management page for internal integrations.
3. Locate the integration used by the retired `notion-tracker` function.
4. If the integration has no other approved consumer, revoke or delete the integration. If it is shared, rotate its secret instead and distribute the replacement only to documented consumers. Do not configure a replacement in this repository or in Supabase because this function has no active consumer.
5. Verify the old credential is rejected without putting it in process arguments or a file:

```bash
curl --silent --show-error --output /dev/null --write-out '%{http_code}\n' \
  --config - <<EOF
url = "https://api.notion.com/v1/users/me"
header = "Authorization: Bearer ${OLD_NOTION_TOKEN}"
header = "Notion-Version: 2022-06-28"
EOF
unset OLD_NOTION_TOKEN
```

Expected status: `401`. Any `2xx` response means revocation is incomplete. Stop and revoke the credential before closing the incident.

## Completion evidence

Record only the deployed commit, deployment timestamp, the three status codes (`401`, `410`, `401`), and the identity of the approving operator. Do not record response headers, JWTs, keys, or the old credential.
