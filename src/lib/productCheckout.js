/** Preserve the merchant's parameters; only remove surrounding whitespace. */
export function icountCheckoutUrl(value) {
  if (!value?.trim()) return null;
  const trimmed = value.trim();
  try {
    const url = new URL(trimmed);
    return url.protocol === 'https:' && url.hostname === 'app.icount.co.il'
      && !url.username && !url.password ? trimmed : null;
  } catch {
    return null;
  }
}

export function landingPageIdentity(value) {
  try {
    const url = new URL(value);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return null;
    return `${url.origin}${url.pathname.replace(/\/+$/, '')}`;
  } catch {
    return null;
  }
}

/** Never guess between products that point to the same landing page. */
export function checkoutForLanding(products, landingUrl) {
  const identity = landingPageIdentity(landingUrl);
  if (!identity) return null;
  const matches = products.filter(product => product.is_published
    && landingPageIdentity(product.external_url) === identity);
  return matches.length === 1 ? icountCheckoutUrl(matches[0].icount_page_url) : null;
}
