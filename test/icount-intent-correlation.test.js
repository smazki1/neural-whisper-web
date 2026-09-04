import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  getICountReference,
  parseICountDocuments,
} from "../supabase/functions/icount-webhook/payload.js";

const createIntentPath = new URL(
  "../supabase/functions/create-payment-intent/index.ts",
  import.meta.url,
);
const webhookPath = new URL(
  "../supabase/functions/icount-webhook/index.ts",
  import.meta.url,
);

test("payment URL carries the intent in m__custom_field and not cr", async () => {
  const source = await readFile(createIntentPath, "utf8");

  assert.match(source, /searchParams\.set\(["']m__custom_field["'],\s*intentId\)/);
  assert.doesNotMatch(source, /searchParams\.set\(["']cr["']/);
});

test("JSON with custom_field continues to parse", async () => {
  const customField = "5c72e0ca-4a07-43d6-8880-6db20fd11fb9";
  const request = new Request("https://example.com/icount-webhook", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ doctype: "invrec", custom_field: customField }),
  });

  const documents = await parseICountDocuments(request);

  assert.equal(documents.length, 1);
  assert.equal(getICountReference(documents[0]), customField);
});

test("form-urlencoded with custom_field parses into the same document shape", async () => {
  const customField = "5c72e0ca-4a07-43d6-8880-6db20fd11fb9";
  const body = new URLSearchParams({
    doctype: "invrec",
    custom_field: customField,
    totalwithvat: "149.90",
  });
  const request = new Request("https://example.com/icount-webhook", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
    body,
  });

  const documents = await parseICountDocuments(request);

  assert.deepEqual(documents, [{
    doctype: "invrec",
    custom_field: customField,
    totalwithvat: "149.90",
  }]);
  assert.equal(getICountReference(documents[0]), customField);
});

test("JSON arrays retain the existing multi-document support", async () => {
  const customField = "5c72e0ca-4a07-43d6-8880-6db20fd11fb9";
  const request = new Request("https://example.com/icount-webhook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([
      { doctype: "invrec", custom_field: customField },
      { doctype: "receipt", custom_field: customField },
    ]),
  });

  const documents = await parseICountDocuments(request);

  assert.equal(documents.length, 2);
  assert.equal(documents[1].doctype, "receipt");
});

test("both content types feed the existing shared document-processing path", async () => {
  const source = await readFile(webhookPath, "utf8");

  assert.match(source, /const documents = await parseICountDocuments\(req\)/);
  assert.match(source, /for \(const doc of documents\)/);
});

test("missing custom_field remains invalid_payload", async () => {
  assert.equal(getICountReference({ doctype: "invrec" }), null);

  const source = await readFile(webhookPath, "utf8");
  assert.match(source, /if \(!reference[^)]*\)[\s\S]*?log\(doc, "invalid_payload"\)/);
});

test("invalid custom_field is rejected before payment intent database access", async () => {
  assert.equal(getICountReference({ custom_field: "not-a-payment-intent-id" }), null);

  const source = await readFile(webhookPath, "utf8");
  const invalidPayloadCheck = source.indexOf('log(doc, "invalid_payload")');
  const paymentIntentAccess = source.indexOf('.from("payment_intents")');
  assert.ok(invalidPayloadCheck >= 0, "invalid_payload handling is missing");
  assert.ok(paymentIntentAccess >= 0, "payment_intents access is missing");
  assert.ok(
    invalidPayloadCheck < paymentIntentAccess,
    "invalid references must be rejected before payment_intents access",
  );
});
