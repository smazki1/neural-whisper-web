import DOMPurify from 'dompurify';

/** Sanitize stored rich text immediately before rendering it as HTML. */
export function sanitizeHtml(content) {
  return DOMPurify.sanitize(content, { USE_PROFILES: { html: true } });
}
