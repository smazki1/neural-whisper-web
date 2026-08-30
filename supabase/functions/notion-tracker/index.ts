const responseHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

const retiredResponseBody = JSON.stringify({ error: "gone" });

export const handler = (_request: Request): Response =>
  new Response(retiredResponseBody, {
    status: 410,
    headers: responseHeaders,
  });

if (import.meta.main) {
  Deno.serve(handler);
}
