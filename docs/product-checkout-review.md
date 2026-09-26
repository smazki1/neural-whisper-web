# Product checkout review

The vault product editor now manages `products.icount_page_url`. The main site's
product page and purchase CTAs on dedicated landing pages read that value.
No schema, payment processing, pricing, or Schooler access changes are required.
Landing matching uses the published product's `external_url`, ignoring its query,
fragment and trailing slashes. Missing, failed or ambiguous matches preserve the
existing page behavior. The accelerator's explicit contact CTA stays a contact CTA.

## Local preview with shared mock data

1. In the companion `ai-master-academy` checkout run:
   `npm run preview:products -- --port=5291`.
2. In this checkout run `node scripts/checkout-preview.mjs`.
3. Open `http://127.0.0.1:5291/admin/products/22222222-2222-4222-8222-222222222222`.
4. Set the landing URL to `https://ai-master.co.il/idea-to-business`, keep the
   synthetic iCount URL, and publish the **local mock** product.
5. Open `http://127.0.0.1:5292/idea-to-business`. All three purchase links must
   contain the saved iCount URL. Changing it in the editor and reloading the
   landing page must update all three.

The preview's Supabase client points to loopback only. Product reads are bridged
to the vault preview's in-memory store; writes from the main site are not
forwarded. No production data is changed. A synthetic iCount URL intentionally
does not lead to a working payment page; do not make a payment while reviewing.
Use the bottom preview control to simulate a failed product read, and click it
again to recover. The generic product page is `/products/demo-product`.

## Verification completed

- Vault: 7 focused product-discovery tests, typecheck, build, scoped lint.
- Main site: 8 focused checkout/purchase regression tests, typecheck and
  application-project typecheck, build, scoped lint (2 pre-existing warnings
  in ProductDetail).
- Browser: invalid URL blocked; saved URL survives reload and unrelated edits;
  clearing the URL restores the existing fallback; read failure restores the
  fallback and recovery restores checkout; all 3 IdeaToBusiness links use the
  edited URL and same-tab navigation; generic product CTA navigates to the
  synthetic iCount URL. Admin and landing checked at 390px and desktop widths.
- Independent spec and code review completed without actionable findings.

Both repositories must be released for the complete feature. The vault can be
released first; after explicit approval of merge/deployment, release the main
site. The existing confirmed production link will then be used. No production
link edit, migration, merge, or deployment was performed during implementation.
