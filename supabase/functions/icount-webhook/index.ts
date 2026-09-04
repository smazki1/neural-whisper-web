import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import {
  getICountAmount,
  getICountReference,
  parseICountDocuments,
} from "./payload.js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, x-icount-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type ICountDocument = {
  doctype?: string;
  docnum?: string;
  totalwithvat?: string | number;
  custom_field?: string;
  client?: { email?: string };
  [key: string]: unknown;
};

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, "Content-Type": "application/json" },
});

const cents = (value: unknown) => Math.round(Number(value) * 100);
const firstString = (doc: ICountDocument, keys: string[]) => {
  for (const key of keys) {
    const value = doc[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const configuredSecret = Deno.env.get("ICOUNT_WEBHOOK_SECRET");
  const suppliedSecret = req.headers.get("X-iCount-Secret");
  if (!configuredSecret || suppliedSecret !== configuredSecret) {
    console.error("iCount webhook authentication failed");
    return json({ error: "unauthorized" }, 401);
  }

  const service = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  const log = async (raw: ICountDocument, result: string) => {
    const { error } = await service.from("icount_webhook_log").insert({ raw, result });
    if (error) console.error("Failed to write webhook log", error);
  };

  try {
    const documents = await parseICountDocuments(req) as ICountDocument[];
    let processed = 0;
    let failed = 0;

    for (const doc of documents) {
      if (doc.doctype !== "invrec") {
        await log(doc, "ignored_document_type");
        continue;
      }

      const reference = getICountReference(doc);
      const amount = getICountAmount(doc);
      if (!reference || amount === null) {
        await log(doc, "invalid_payload");
        failed++;
        continue;
      }

      try {
        const docUrl = firstString(doc, ["doc_url", "docurl", "document_url", "pdf_url"]);
        const confirmationCode = firstString(doc, ["confirmation_code", "confirmationcode", "confirmation"]);

        const { data: intent, error: intentLookupError } = await service
          .from("payment_intents")
          .select("id, status, expected_amount, icount_doc_number")
          .eq("id", reference)
          .maybeSingle();
        if (intentLookupError) throw intentLookupError;

        if (intent) {
          if (cents(intent.expected_amount) !== cents(amount)) {
            const { error } = await service
              .from("payment_intents")
              .update({ status: "failed", failure_reason: "amount_mismatch", amount_paid: amount })
              .eq("id", intent.id)
              .eq("status", "pending");
            if (error) throw error;
            await log(doc, "amount_mismatch");
            failed++;
            continue;
          }

          if (intent.status === "paid" || intent.status === "claimed") {
            await log(doc, "payment_intent_already_processed");
            processed++;
            continue;
          }

          const { error } = await service
            .from("payment_intents")
            .update({
              status: "paid",
              amount_paid: amount,
              buyer_email: doc.client?.email?.trim().toLowerCase() || null,
              icount_doc_number: doc.docnum || null,
              icount_confirmation_code: confirmationCode,
              icount_doc_url: docUrl,
              paid_at: new Date().toISOString(),
              failure_reason: null,
            })
            .eq("id", intent.id)
            .eq("status", "pending");
          if (error) throw error;

          await log(doc, "payment_intent_paid");
          processed++;
          continue;
        }

        // Compatibility for the existing logged-in purchase flow used by other products.
        const { data: entitlement, error: entitlementLookupError } = await service
          .from("entitlements")
          .select("id, status, products(price, discount_price)")
          .eq("id", reference)
          .maybeSingle();
        if (entitlementLookupError) throw entitlementLookupError;

        if (entitlement) {
          const product = Array.isArray(entitlement.products) ? entitlement.products[0] : entitlement.products;
          const expected = Number(Number(product?.discount_price) > 0 ? product?.discount_price : product?.price);
          if (!Number.isFinite(expected) || cents(expected) !== cents(amount)) {
            await log(doc, "entitlement_amount_mismatch");
            failed++;
            continue;
          }

          const { error } = await service.from("entitlements").update({
            status: "paid",
            amount_paid: amount,
            icount_doc_number: doc.docnum || null,
            icount_confirmation_code: confirmationCode,
            icount_doc_url: docUrl,
            granted_at: new Date().toISOString(),
          }).eq("id", entitlement.id);
          if (error) throw error;

          await log(doc, entitlement.status === "paid" ? "entitlement_already_paid" : "entitlement_paid");
          processed++;
          continue;
        }

        // Compatibility for the original order-based checkout.
        const { data: order, error: orderLookupError } = await service
          .from("orders")
          .select("id, user_id, product_id, total_amount")
          .eq("id", reference)
          .maybeSingle();
        if (orderLookupError) throw orderLookupError;
        if (!order) {
          await log(doc, "reference_not_found");
          failed++;
          continue;
        }
        if (cents(order.total_amount) !== cents(amount)) {
          await log(doc, "order_amount_mismatch");
          failed++;
          continue;
        }

        const { error: orderUpdateError } = await service
          .from("orders")
          .update({ status: "completed", updated_at: new Date().toISOString() })
          .eq("id", order.id);
        if (orderUpdateError) throw orderUpdateError;

        const { data: existingPayment } = await service
          .from("payments")
          .select("id")
          .eq("transaction_id", doc.docnum || "")
          .maybeSingle();
        if (!existingPayment) {
          const { error: paymentError } = await service.from("payments").insert({
            order_id: order.id,
            amount,
            currency: "ILS",
            payment_method: "icount",
            transaction_id: doc.docnum || null,
            status: "completed",
            processed_at: new Date().toISOString(),
          });
          if (paymentError) throw paymentError;
        }

        await log(doc, "order_paid");
        processed++;
      } catch (error) {
        console.error("Failed to process iCount document", doc.docnum, error);
        await log(doc, "processing_error");
        failed++;
      }
    }

    return json({ success: failed === 0, processed, failed }, failed > 0 ? 500 : 200);
  } catch (error) {
    console.error("iCount webhook failed", error);
    return json({ error: "internal_error" }, 500);
  }
});
