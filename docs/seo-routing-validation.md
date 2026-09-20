# SEO routing and metadata validation

Base: `origin/main` at `fbf7c00673683fc78af70074609fce0122531aed` (fetched before changes).

- Tests were written and run before implementation. The final 13-test suite against a clean archive of the same base gives **11 failures, 2 preservation passes**. The corrected tree gives **13/13 passes**.
- RED reproduces HTML at `/sitemap.xml`, wrong sitemap/robots/blog domains, invalid XML for reserved slug characters, missing www redirect, soft 404s, and the WhatsApp placeholder. Existing SPA routes and asset precedence pass on the base.
- GREEN exercises the actual sitemap handler with database fixtures, parses XML, renders the actual BlogPost metadata JSX, and sends HTTP requests through a local harness for the checked-in Vercel rules. No database writes or fixtures were created remotely.
- Every declared SPA path is covered, including trailing slashes, reset tokens, blog editor IDs, product slugs, course/lesson IDs, payment pages and nested admin paths. Unmatched paths return HTTP 404 with the existing SPA error page; existing files keep precedence.
- `npm test`: **96/96 passed** with Node **22.23.2** (`npm exec --yes --package=node@22 -- npm test`). The initial Node 22.15 run failed an existing test's direct `.ts` import; no unrelated source change was needed.
- `npm run typecheck`: passed. `npm run lint:ci`: passed, 0 errors and 81 warnings. `npm run build`: passed. `git diff --check`: passed.
- Vercel `routes` and `$schema` fields passed the unchanged relevant definitions downloaded from https://openapi.vercel.sh/vercel.json using Ajv. Full-schema compilation encountered mixed draft keywords in unrelated experimental function definitions; validation was therefore limited to the fields this project uses.
- The [official routing reference](https://vercel.com/docs/project-configuration/vercel-json#routes) documents external destinations, host conditions, redirect headers and status codes. Schema validation and the HTTP harness do not prove deployed Vercel behavior.
- Browser smoke on the local production build: contact page, empty blog state and existing 404 screen render. Contact/blog console had no errors. No published post was available, so BlogPost metadata was verified with synthetic render data. The Vite preview server does not implement Vercel HTTP status rules.

## Release steps requiring separate approval

1. Deploy only the corrected `generate-sitemap` Edge Function to existing project `ekqmbmfkzmqcxthsdgwg`, preserving its current public, unauthenticated invocation behavior. Do not deploy unrelated functions or change database/Auth/Storage. This PR alone does not update that live function.
2. Deploy the reviewed website commit to the existing Vercel project `visionary-brain-web`. The repository includes the www-to-apex 308 rule; no direct Vercel domain-setting change was made or is expected if both existing domains continue to target this project.
3. Verify live `/sitemap.xml` XML and `application/xml` Content-Type, primary-domain URLs without tag/category paths, `/robots.txt`, `www` deep-path redirect, random-path HTTP 404, and valid static/dynamic SPA paths. If www bypasses the repository rule because of project domain settings, configure `www.ai-master.co.il` to redirect permanently to `ai-master.co.il` while preserving the path, only with deployment-stage approval.

No merge, manual deployment, Production setting, database, Auth, Storage, payment or business action was performed. NEXT APPROVED remains unchanged.
