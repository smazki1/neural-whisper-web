import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const allowedOrigins = new Set([
  "https://vault.ai-master.co.il",
  "https://ai-master.co.il",
  "https://www.ai-master.co.il",
  "http://localhost:5173",
  "http://localhost:8080",
]);

const corsHeaders = (origin: string) => ({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Cache-Control": "no-store",
  "Vary": "Origin",
});

const json = (origin: string, body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
});

const hex = (bytes: ArrayBuffer) => Array.from(new Uint8Array(bytes))
  .map((byte) => byte.toString(16).padStart(2, "0"))
  .join("");

const fingerprintRequest = async (req: Request, secret: string) => {
  const forwardedFor = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const clientAddress = req.headers.get("cf-connecting-ip") ??
    forwardedFor ??
    req.headers.get("x-real-ip") ??
    "unknown";
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return hex(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(clientAddress)));
};

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("Origin") ?? "";
  if (!allowedOrigins.has(origin)) {
    return new Response(JSON.stringify({ error: "origin_not_allowed" }), {
      status: 403,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin) });
  if (req.method !== "POST") return json(origin, { error: "method_not_allowed" }, 405);

  try {
    const requestBody = await req.text();
    const byteLength = new TextEncoder().encode(requestBody).byteLength;
    if (byteLength > 1024) return json(origin, { error: "request_too_large" }, 413);

    let body: unknown;
    try {
      body = JSON.parse(requestBody);
    } catch {
      return json(origin, { error: "invalid_request" }, 400);
    }
    const productId = typeof body === "object" && body !== null && "productId" in body
      ? (body as { productId?: unknown }).productId
      : undefined;
    if (typeof productId !== "string" || !/^[0-9a-f-]{36}$/i.test(productId)) {
      return json(origin, { error: "invalid_product" }, 400);
    }

    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    if (!serviceRoleKey) throw new Error("missing_service_role_key");

    const service = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      serviceRoleKey,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    const { data: product, error: productError } = await service
      .from("products")
      .select("id, price, discount_price, is_free, is_published, icount_page_url")
      .eq("id", productId)
      .eq("is_published", true)
      .maybeSingle();

    if (productError) throw productError;
    if (!product || product.is_free || !product.icount_page_url) {
      return json(origin, { error: "product_not_purchasable" }, 404);
    }

    const expected_amount = Number(
      Number(product.discount_price) > 0 ? product.discount_price : product.price,
    );
    if (!Number.isFinite(expected_amount) || expected_amount <= 0) {
      return json(origin, { error: "invalid_product_price" }, 409);
    }

    const paypage = new URL(product.icount_page_url);
    if (paypage.protocol !== "https:" || paypage.hostname !== "app.icount.co.il") {
      return json(origin, { error: "invalid_paypage" }, 409);
    }

    const request_fingerprint = await fingerprintRequest(req, serviceRoleKey);
    const { data: intentId, error: insertError } = await service.rpc(
      "create_payment_intent_limited",
      {
        p_product_id: product.id,
        p_expected_amount: expected_amount,
        p_request_fingerprint: request_fingerprint,
      },
    );

    if (insertError?.code === "P0001" && insertError.message === "rate_limited") {
      return json(origin, { error: "rate_limited" }, 429);
    }
    if (insertError) throw insertError;
    paypage.searchParams.delete("cr");
    paypage.searchParams.set("m__custom_field", intentId);

    return json(origin, { intentId, url: paypage.toString() }, 201);
  } catch (error) {
    console.error("create-payment-intent failed", error);
    return json(origin, { error: "internal_error" }, 500);
  }
});
