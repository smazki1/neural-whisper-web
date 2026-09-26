import assert from 'node:assert/strict';
import test from 'node:test';
import { checkoutForLanding, icountCheckoutUrl, landingPageIdentity } from '../src/lib/productCheckout.js';

const checkout = 'https://app.icount.co.il/m/merchant/course?utm_source=iCount&campaign=19#pay';
const product = { id: 'one', is_published: true, external_url: 'https://ai-master.co.il/idea-to-business/', icount_page_url: checkout };

test('checkout validation preserves parameters and trims whitespace', () => {
  assert.equal(icountCheckoutUrl(` ${checkout} `), checkout);
  for (const value of [null, '', '  ', '/checkout', 'http://app.icount.co.il/m/test', 'https://other.test', 'https://app.icount.co.il.evil.test', 'https://user:pass@app.icount.co.il', 'javascript:alert(1)']) {
    assert.equal(icountCheckoutUrl(value), null);
  }
});

test('landing matching ignores query, hash and trailing slashes, but keeps origin and path', () => {
  assert.equal(checkoutForLanding([product], 'https://ai-master.co.il/idea-to-business?utm_source=test#enroll'), checkout);
  assert.notEqual(landingPageIdentity('https://other.test/idea-to-business'), landingPageIdentity(product.external_url));
  assert.equal(checkoutForLanding([product], 'https://ai-master.co.il/other-course'), null);
});

test('each product resolves its own payment page and refreshed records use the new link', () => {
  const other = { ...product, id: 'two', external_url: 'https://ai-master.co.il/business-workshop', icount_page_url: `${checkout}&second=1` };
  assert.equal(checkoutForLanding([product, other], other.external_url), other.icount_page_url);
  assert.equal(checkoutForLanding([{ ...product, icount_page_url: other.icount_page_url }], product.external_url), other.icount_page_url);
});

test('missing, unpublished, invalid and ambiguous destinations fall back without guessing', () => {
  for (const products of [[], [{ ...product, is_published: false }], [{ ...product, icount_page_url: '' }], [{ ...product, icount_page_url: 'broken' }], [product, { ...product, id: 'two' }]]) {
    assert.equal(checkoutForLanding(products, product.external_url), null);
  }
  assert.equal(checkoutForLanding([product, { ...product, id: 'draft', is_published: false }], product.external_url), checkout);
});
