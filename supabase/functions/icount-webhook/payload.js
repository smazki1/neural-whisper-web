const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * @param {Request} req
 * @returns {Promise<Array<Record<string, unknown>>>}
 */
export const parseICountDocuments = async (req) => {
  const contentType = req.headers.get("Content-Type")?.split(";", 1)[0].trim().toLowerCase();
  const payload = contentType === "application/x-www-form-urlencoded"
    ? Object.fromEntries(new URLSearchParams(await req.text()))
    : await req.json();

  return Array.isArray(payload) ? payload : [payload];
};

/** @param {Record<string, unknown>} doc */
export const getICountReference = (doc) => {
  const reference = typeof doc.custom_field === "string" ? doc.custom_field.trim() : "";
  return uuidPattern.test(reference) ? reference : null;
};
