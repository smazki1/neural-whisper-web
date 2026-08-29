import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const jsonResponse = (
  status: number,
  body: Record<string, unknown>,
  extraHeaders = {},
) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      ...extraHeaders,
      "Content-Type": "application/json",
    },
  });

type ClientFactory = typeof createClient;

export const createHandler =
  (clientFactory: ClientFactory = createClient) => async (req: Request) => {
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (req.method !== "POST") {
      return jsonResponse(405, { error: "Method not allowed" }, {
        Allow: "POST, OPTIONS",
      });
    }

    const authorization = req.headers.get("Authorization");
    const bearerMatch = authorization?.match(/^Bearer\s+([^\s]+)$/i);

    if (!authorization || !bearerMatch) {
      return jsonResponse(401, { error: "Unauthorized" });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Course access configuration is unavailable");
      return jsonResponse(500, { error: "Internal server error" });
    }

    const supabase = clientFactory(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authorization } },
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
    });

    const { data: authData, error: authError } = await supabase.auth.getUser(
      bearerMatch[1],
    );
    const user = authData?.user;

    if (authError || !user) {
      return jsonResponse(401, { error: "Unauthorized" });
    }

    let orderId: unknown;

    try {
      ({ orderId } = await req.json());
    } catch {
      return jsonResponse(400, { error: "Invalid request" });
    }

    if (typeof orderId !== "string" || !uuidPattern.test(orderId)) {
      return jsonResponse(400, { error: "Invalid request" });
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, product_id")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .eq("status", "completed")
      .maybeSingle();

    if (orderError) {
      console.error("Course access order lookup failed");
      return jsonResponse(500, { error: "Internal server error" });
    }

    if (!order) {
      return jsonResponse(403, { error: "Access denied" });
    }

    const { data: productCourses, error: coursesError } = await supabase
      .from("products_courses")
      .select("course_id")
      .eq("product_id", order.product_id);

    if (coursesError || !productCourses) {
      console.error("Course access mapping lookup failed");
      return jsonResponse(500, { error: "Internal server error" });
    }

    const courseIds = [
      ...new Set(productCourses.map(({ course_id: courseId }) => courseId)),
    ];

    if (courseIds.length === 0) {
      return jsonResponse(403, { error: "Access denied" });
    }

    const readExistingAccess = () =>
      supabase
        .from("user_course_access")
        .select("course_id")
        .eq("user_id", user.id)
        .in("course_id", courseIds);

    const calculateMissingAccess = (
      existingAccess: Array<{ course_id: string }>,
    ) => {
      const existingCourseIds = new Set(
        existingAccess.map(({ course_id: courseId }) => courseId),
      );
      return courseIds
        .filter((courseId) => !existingCourseIds.has(courseId))
        .map((courseId) => ({
          user_id: user.id,
          course_id: courseId,
          product_id: order.product_id,
          order_id: order.id,
        }));
    };

    const readMissingAccess = async () => {
      const { data: existingAccess, error: existingAccessError } =
        await readExistingAccess();

      if (existingAccessError || !Array.isArray(existingAccess)) {
        return null;
      }

      return calculateMissingAccess(existingAccess);
    };

    const insertMissingAccess = async (
      missingAccess: Array<{
        user_id: string;
        course_id: string;
        product_id: string;
        order_id: string;
      }>,
    ) => {
      const { error } = await supabase
        .from("user_course_access")
        .insert(missingAccess);
      return error;
    };

    let missingAccess = await readMissingAccess();

    if (!missingAccess) {
      console.error("Course access lookup failed");
      return jsonResponse(500, { error: "Internal server error" });
    }

    if (missingAccess.length === 0) {
      return jsonResponse(200, { success: true });
    }

    const insertError = await insertMissingAccess(missingAccess);

    if (!insertError) {
      return jsonResponse(200, { success: true });
    }

    if (insertError.code !== "23505") {
      console.error("Course access write failed");
      return jsonResponse(500, { error: "Internal server error" });
    }

    missingAccess = await readMissingAccess();

    if (!missingAccess) {
      console.error("Course access replay verification failed");
      return jsonResponse(500, { error: "Internal server error" });
    }

    if (missingAccess.length === 0) {
      return jsonResponse(200, { success: true });
    }

    const retryError = await insertMissingAccess(missingAccess);

    if (!retryError) {
      return jsonResponse(200, { success: true });
    }

    const remainingAccess = await readMissingAccess();

    if (!remainingAccess || remainingAccess.length > 0) {
      console.error("Course access replay verification failed");
      return jsonResponse(500, { error: "Internal server error" });
    }

    return jsonResponse(200, { success: true });
  };

if (import.meta.main) {
  serve(createHandler());
}
