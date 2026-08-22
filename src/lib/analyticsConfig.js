const GA4_ID_PATTERN = /^G-[A-Z0-9]{6,}$/;

export function normalizeGoogleAnalyticsId(value) {
  const normalized = typeof value === 'string' ? value.trim().toUpperCase() : '';

  if (!GA4_ID_PATTERN.test(normalized) || /^G-X+$/.test(normalized)) return null;
  return normalized;
}
