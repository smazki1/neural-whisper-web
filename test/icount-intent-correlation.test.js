import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  getICountAmount,
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
const jsonFixturePath = new URL(
  "./fixtures/icount-callback.json",
  import.meta.url,
);
const formFixturePath = new URL(
  "./fixtures/icount-callback.form.txt",
  import.meta.url,
);

test("payment URL carries the intent in m__custom_field and not cr", async () => {
  const source = await readFile(createIntentPath, "utf8");

  assert.match(source, /searchParams\.set\(["']m__custom_field["'],\s*intentId\)/);
  assert.doesNotMatch(source, /searchParams\.set\(["']cr["']/);
});

test("the observed JSON structure normalizes its processing fields", async () => {
  const body = await readFile(jsonFixturePath, "utf8");
  const request = new Request("https://example.com/icount-webhook", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body,
  });

  const documents = await parseICountDocuments(request);

  assert.equal(documents.length, 1);
  assert.equal(documents[0].doctype, "invrec");
  assert.equal(documents[0].docnum, "INV-FIXTURE-1001");
  assert.equal(documents[0].totalwithvat, 149.9);
  assert.equal(typeof documents[0].totalwithvat, "number");
  assert.equal(documents[0].custom_field, null);
  assert.equal(documents[0].doc_url, "https://example.test/invoice.pdf");
  assert.equal(documents[0].client.email, "buyer@example.test");
});

test("the observed form-urlencoded structure normalizes into the same shape", async () => {
  const body = await readFile(formFixturePath, "utf8");
  const request = new Request("https://example.com/icount-webhook", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
    body,
  });

  const documents = await parseICountDocuments(request);

  assert.equal(documents.length, 1);
  assert.equal(documents[0].doctype, "invrec");
  assert.equal(documents[0].docnum, "INV-FIXTURE-1001");
  assert.equal(documents[0].custom_field, "11111111-1111-4111-8111-111111111111");
  assert.equal(documents[0].totalwithvat, 149.9);
  assert.equal(typeof documents[0].totalwithvat, "number");
  assert.equal(documents[0].confirmation_code, "CONFIRM-FIXTURE");
  assert.equal(documents[0].doc_url, "https://example.test/invoice.pdf");
  assert.equal(documents[0].client.email, "buyer@example.test");
});

test("custom_field is preserved during normalization", async () => {
  const body = await readFile(formFixturePath, "utf8");
  const request = new Request("https://example.com/icount-webhook", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const [document] = await parseICountDocuments(request);

  assert.equal(getICountReference(document), "11111111-1111-4111-8111-111111111111");
});

test("the transaction amount is exposed as a finite number", async () => {
  const body = await readFile(formFixturePath, "utf8");
  const request = new Request("https://example.com/icount-webhook", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const [document] = await parseICountDocuments(request);

  assert.equal(getICountAmount(document), 149.9);
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

test("the existing root-level totalwithvat support is retained", async () => {
  const request = new Request("https://example.com/icount-webhook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      doctype: "invrec",
      custom_field: "11111111-1111-4111-8111-111111111111",
      totalwithvat: 42.5,
    }),
  });

  const [document] = await parseICountDocuments(request);

  assert.equal(getICountReference(document), "11111111-1111-4111-8111-111111111111");
  assert.equal(getICountAmount(document), 42.5);
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

test("missing amount remains invalid_payload", async () => {
  assert.equal(getICountAmount({
    doctype: "invrec",
    custom_field: "11111111-1111-4111-8111-111111111111",
  }), null);

  const source = await readFile(webhookPath, "utf8");
  assert.match(source, /if \(!reference \|\| amount === null\)[\s\S]*?log\(doc, "invalid_payload"\)/);
});

test("a valid callback reaches the payment intent lookup path", async () => {
  const body = await readFile(formFixturePath, "utf8");
  const request = new Request("https://example.com/icount-webhook", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const [document] = await parseICountDocuments(request);
  const source = await readFile(webhookPath, "utf8");

  assert.ok(getICountReference(document));
  assert.notEqual(getICountAmount(document), null);
  assert.ok(source.indexOf("getICountReference(doc)") < source.indexOf('.from("payment_intents")'));
  assert.ok(source.indexOf("getICountAmount(doc)") < source.indexOf('.from("payment_intents")'));
});

test("duplicate callbacks cannot update a payment intent twice", async () => {
  const source = await readFile(webhookPath, "utf8");
  const alreadyProcessedCheck = source.indexOf('intent.status === "paid" || intent.status === "claimed"');
  const guardedUpdate = source.indexOf('.eq("status", "pending")', alreadyProcessedCheck);

  assert.ok(alreadyProcessedCheck >= 0, "already-processed intents must short-circuit");
  assert.ok(guardedUpdate > alreadyProcessedCheck, "the payment update must remain guarded by pending status");
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
