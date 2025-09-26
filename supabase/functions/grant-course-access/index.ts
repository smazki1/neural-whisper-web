import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId } = await req.json();

    if (!orderId) {
      throw new Error("Order ID is required");
    }

    // Create Supabase client with service role key to bypass RLS
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, user_id, product_id, status")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      throw new Error("Order not found");
    }

    if (order.status !== "completed") {
      throw new Error("Order is not completed");
    }

    // Get courses linked to this product
    const { data: productCourses, error: coursesError } = await supabase
      .from("products_courses")
      .select("course_id")
      .eq("product_id", order.product_id);

    if (coursesError) {
      throw new Error("Failed to fetch product courses");
    }

    if (!productCourses || productCourses.length === 0) {
      console.log("No courses linked to this product");
      return new Response(
        JSON.stringify({ success: true, message: "No courses to grant access to" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Grant access to all courses linked to this product
    const accessPromises = productCourses.map(pc => 
      supabase
        .from("user_course_access")
        .upsert({
          user_id: order.user_id,
          course_id: pc.course_id,
          product_id: order.product_id,
          order_id: order.id,
          granted_at: new Date().toISOString()
        }, {
          onConflict: "user_id,course_id"
        })
    );

    await Promise.all(accessPromises);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Access granted to ${productCourses.length} course(s)` 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error granting course access:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});