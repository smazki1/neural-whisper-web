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
    const { productId } = await req.json();
    if (typeof productId !== "string" || !/^[0-9a-f-]{36}$/i.test(productId)) {
      return json({ error: "invalid_product" }, 400);
    }

    const service = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
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
      return json({ error: "product_not_purchasable" }, 404);
    }

    const expected_amount = Number(
      Number(product.discount_price) > 0 ? product.discount_price : product.price,
    );
    if (!Number.isFinite(expected_amount) || expected_amount <= 0) {
      return json({ error: "invalid_product_price" }, 409);
    }

    const paypage = new URL(product.icount_page_url);
    if (paypage.protocol !== "https:" || paypage.hostname !== "app.icount.co.il") {
      return json({ error: "invalid_paypage" }, 409);
    }

    const { data: intent, error: insertError } = await service
      .from("payment_intents")
      .insert({ product_id: product.id, expected_amount })
      .select("id")
      .single();

    if (insertError) throw insertError;
    paypage.searchParams.set("cr", intent.id);

    return json({ intentId: intent.id, url: paypage.toString() }, 201);
  } catch (error) {
    console.error("create-payment-intent failed", error);
    return json({ error: "internal_error" }, 500);
  }
});
