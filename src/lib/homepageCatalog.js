// Existing product fields drive the two homepage catalogs. No featured flag is required.
export function getHomepageCatalogs(products) {
  const published = products.filter((product) => product.is_published === true);
  const sorted = [...published].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
  return {
    courses: sorted.filter((p) => p.product_type === 'course'),
    organizations: sorted.filter((p) => p.product_type === 'workshop' && p.category === 'business'),
  };
}

export function getProductDestination(product) {
  const external = product.external_url?.trim();
  if (external && (/^https?:\/\//i.test(external) || /^\/(?!\/)/.test(external))) return external;
  return product.slug ? `/products/${encodeURIComponent(product.slug)}` : '/corporate-workshops';
}

export function getProductSummary(product) {
  return (product.short_description || product.description || '').replace(/<[^>]*>/g, '').trim();
}
