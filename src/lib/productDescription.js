const blockClosingTags = /<\/(?:p|div|li|h[1-6])\s*>/gi;
const lineBreakTags = /<br\s*\/?>/gi;
const remainingTags = /<[^>]*>/g;

const decodeEntities = (value) => value
  .replaceAll('&nbsp;', ' ')
  .replaceAll('&amp;', '&')
  .replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>')
  .replaceAll('&quot;', '"')
  .replaceAll('&#39;', "'");

export function productDescriptionParagraphs(value) {
  return decodeEntities(value)
    .replace(lineBreakTags, '\n')
    .replace(blockClosingTags, '\n\n')
    .replace(remainingTags, '')
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
