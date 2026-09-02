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

    const { data: claim, error: claimError } = await service.rpc("claim_payment_transaction", {
      p_intent_id: intentId,
      p_user_id: user.id,
      p_user_email: user.email,
    });

    if (claimError) throw claimError;
    if (!claim || typeof claim !== "object" || Array.isArray(claim)) {
      throw new Error("invalid_claim_result");
    }

    return json(claim);
  } catch (error) {
    console.error("claim-payment failed", error);
    return json({ error: "internal_error" }, 500);
  }
});
