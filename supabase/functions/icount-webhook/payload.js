const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const firstString = (record, keys) => {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
};

const firstNumber = (record, keys) => {
  for (const key of keys) {
    const value = record[key];
    if (typeof value !== "number" && typeof value !== "string") continue;
    if (typeof value === "string" && !value.trim()) continue;

    const number = Number(value);
    if (Number.isFinite(number)) return number;
  }
  return null;
};

const normalizeICountDocument = (payload) => {
  const doc = payload && typeof payload === "object" && !Array.isArray(payload)
    ? payload
    : {};
  const existingClient = doc.client && typeof doc.client === "object" && !Array.isArray(doc.client)
    ? doc.client
    : {};
  const email = firstString(existingClient, ["email"])
    ?? firstString(doc, ["customer_email"]);

  return {
    ...doc,
    custom_field: firstString(doc, ["custom_field"]),
    totalwithvat: firstNumber(doc, ["totalwithvat", "sum", "total_paid", "cc_total"]),
    doc_url: firstString(doc, ["doc_url", "docurl", "document_url", "pdf_url", "doc_link", "pdf_link"]),
    confirmation_code: firstString(doc, ["confirmation_code", "confirmationcode", "confirmation"]),
    client: {
      ...existingClient,
      ...(email ? { email } : {}),
    },
  };
};

/**
 * @param {Request} req
 * @returns {Promise<Array<Record<string, unknown>>>}
 */
export const parseICountDocuments = async (req) => {
  const contentType = req.headers.get("Content-Type")?.split(";", 1)[0].trim().toLowerCase();
  const body = await req.text();
  let payload;

  if (contentType === "application/x-www-form-urlencoded") {
    payload = Object.fromEntries(new URLSearchParams(body));
  } else {
    try {
      payload = JSON.parse(body);
    } catch (error) {
      if (contentType === "application/json") throw error;
      payload = Object.fromEntries(new URLSearchParams(body));
    }
  }

  const documents = Array.isArray(payload) ? payload : [payload];
  return documents.map(normalizeICountDocument);
};

/** @param {Record<string, unknown>} doc */
export const getICountReference = (doc) => {
  const reference = typeof doc.custom_field === "string" ? doc.custom_field.trim() : "";
  return uuidPattern.test(reference) ? reference : null;
};

/** @param {Record<string, unknown>} doc */
export const getICountAmount = (doc) => firstNumber(doc, ["totalwithvat"]);
