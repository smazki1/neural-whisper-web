const PRIVATE_LESSON_CONTENT_PUBLIC_URL =
  /\/storage\/v1\/object\/public\/lesson-content(?:\/|$)/i;

export function resolveProductImageUrl(imageUrl, fallbackUrl) {
  const normalizedUrl = typeof imageUrl === 'string' ? imageUrl.trim() : '';

  if (!normalizedUrl || PRIVATE_LESSON_CONTENT_PUBLIC_URL.test(normalizedUrl)) {
    return fallbackUrl;
  }

  return normalizedUrl;
}
