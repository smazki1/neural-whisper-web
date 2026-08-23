import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, "Content-Type": "application/json" },
});

const normalizeEmail = (value: string | null | undefined) => value?.trim().toLowerCase() ?? "";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  try {
    const authorization = req.headers.get("Authorization") ?? "";
    const token = authorization.replace(/^Bearer\s+/i, "");
    if (!token) return json({ error: "unauthorized" }, 401);

    const service = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    const { data: authData, error: authError } = await service.auth.getUser(token);
    const user = authData.user;
    if (authError || !user?.email) return json({ error: "unauthorized" }, 401);

    const { intentId } = await req.json();
    if (typeof intentId !== "string" || !/^[0-9a-f-]{36}$/i.test(intentId)) {
      return json({ error: "invalid_intent" }, 400);
    }

    const { data: intent, error: intentError } = await service
      .from("payment_intents")
      .select("id, product_id, status, buyer_email, amount_paid, icount_doc_number, icount_confirmation_code, icount_doc_url, claimed_by, products(slug)")
      .eq("id", intentId)
      .maybeSingle();

    if (intentError) throw intentError;
    if (!intent) return json({ status: "not_found" });
    if (intent.status === "pending") return json({ status: "pending" });
    if (intent.status === "failed") return json({ status: "failed" });

    if (intent.status === "claimed") {
      if (intent.claimed_by !== user.id) return json({ status: "already_claimed" });
      const product = Array.isArray(intent.products) ? intent.products[0] : intent.products;
      return json({ status: "claimed", productSlug: product?.slug, docUrl: intent.icount_doc_url });
    }

    if (normalizeEmail(intent.buyer_email) !== normalizeEmail(user.email)) {
      return json({ status: "email_mismatch" });
    }

    const now = new Date().toISOString();
    const { error: entitlementError } = await service
      .from("entitlements")
      .upsert({
        user_id: user.id,
        product_id: intent.product_id,
        status: "paid",
        amount_paid: intent.amount_paid,
        icount_doc_number: intent.icount_doc_number,
        icount_confirmation_code: intent.icount_confirmation_code,
        icount_doc_url: intent.icount_doc_url,
        granted_at: now,
      }, { onConflict: "user_id,product_id" });

    if (entitlementError) throw entitlementError;

    const { data: claimed, error: claimError } = await service
      .from("payment_intents")
      .update({ status: "claimed", claimed_by: user.id, claimed_at: now })
      .eq("id", intent.id)
      .eq("status", "paid")
      .select("id")
      .maybeSingle();

    if (claimError) throw claimError;
    if (!claimed) return json({ status: "retry" });

    const product = Array.isArray(intent.products) ? intent.products[0] : intent.products;
    return json({ status: "claimed", productSlug: product?.slug, docUrl: intent.icount_doc_url });
  } catch (error) {
    console.error("claim-payment failed", error);
    return json({ error: "internal_error" }, 500);
  }
});
