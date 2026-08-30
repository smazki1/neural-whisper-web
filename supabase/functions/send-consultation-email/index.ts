const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const jsonResponse = (status: number, error: string): Response =>
  new Response(JSON.stringify({ error }), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });

export const handler = (request: Request): Response => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method === "POST") {
    return jsonResponse(410, "gone");
  }

  const response = jsonResponse(405, "method_not_allowed");
  response.headers.set("Allow", "POST, OPTIONS");
  return response;
};

if (import.meta.main) {
  Deno.serve(handler);
}
