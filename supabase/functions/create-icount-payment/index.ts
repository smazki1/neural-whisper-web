const headers = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

Deno.serve(() => new Response(
  JSON.stringify({ error: "gone" }),
  { status: 410, headers },
));
