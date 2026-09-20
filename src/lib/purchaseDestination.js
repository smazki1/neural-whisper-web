const VAULT_ORIGIN = 'https://vault.ai-master.co.il';

export function getVaultPurchaseUrl(product) {
  const slug = encodeURIComponent(product.slug);

  if (product.product_type === 'course') {
    return `${VAULT_ORIGIN}/courses/${slug}`;
  }

  if (product.product_type === 'prompt_pack') {
    return `${VAULT_ORIGIN}/prompts/packs/${slug}`;
  }

  return `${VAULT_ORIGIN}/store/${slug}`;
}
