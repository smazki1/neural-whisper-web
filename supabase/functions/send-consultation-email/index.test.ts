import { handler } from "./index.ts";

const assert = (condition: unknown, message = "Assertion failed") => {
  if (!condition) throw new Error(message);
};

const assertEquals = (actual: unknown, expected: unknown) => {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);
  if (actualJson !== expectedJson) {
    throw new Error(`Expected ${expectedJson}, received ${actualJson}`);
  }
};

const request = (method: string, body?: string) =>
  new Request("http://localhost/send-consultation-email", {
    method,
    body,
  });

Deno.test("POST returns the fixed 410 tombstone response", async () => {
  const response = handler(request("POST", '{"private":"payload"}'));

  assertEquals(response.status, 410);
  assertEquals(response.headers.get("Content-Type"), "application/json");
  assertEquals(await response.json(), { error: "gone" });
});

Deno.test("POST does not read or consume the request body", () => {
  let bodyAccesses = 0;
  const target = request("POST", '{"private":"payload"}');
  const guardedRequest = new Proxy(target, {
    get(requestTarget, property) {
      if (
        ["arrayBuffer", "blob", "body", "formData", "json", "text"].includes(
          String(property),
        )
      ) {
        bodyAccesses += 1;
        throw new Error("request body was accessed");
      }
      return Reflect.get(requestTarget, property, requestTarget);
    },
  });

  const response = handler(guardedRequest);

  assertEquals(response.status, 410);
  assertEquals(bodyAccesses, 0);
  assertEquals(target.bodyUsed, false);
});

Deno.test("OPTIONS returns only CORS metadata without side effects", async () => {
  const originalFetch = globalThis.fetch;
  let fetchCalls = 0;
  globalThis.fetch = (() => {
    fetchCalls += 1;
    throw new Error("external request attempted");
  }) as typeof fetch;

  try {
    const response = handler(request("OPTIONS"));
    assertEquals(response.status, 204);
    assertEquals(await response.text(), "");
    assertEquals(response.headers.get("Access-Control-Allow-Origin"), "*");
    assertEquals(
      response.headers.get("Access-Control-Allow-Methods"),
      "POST, OPTIONS",
    );
    assertEquals(fetchCalls, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("unsupported methods are rejected explicitly", async () => {
  const response = handler(request("PUT", '{"private":"payload"}'));

  assertEquals(response.status, 405);
  assertEquals(response.headers.get("Allow"), "POST, OPTIONS");
  assertEquals(await response.json(), { error: "method_not_allowed" });
});

Deno.test("responses contain no provider, secret, or internal identifiers", async () => {
  const responses = [
    handler(request("POST", "sensitive")),
    handler(request("DELETE")),
  ];

  for (const response of responses) {
    const body = await response.text();
    assert(
      !/resend|provider|secret|api[_ -]?key|send-consultation-email|ekqmbmfkzmqcxthsdgwg|[0-9a-f]{8}-[0-9a-f-]{27,}/i
        .test(body),
      `response exposed forbidden detail: ${body}`,
    );
  }
});

Deno.test("deployment config requires JWT verification", async () => {
  const config = await Deno.readTextFile(
    new URL("../../config.toml", import.meta.url),
  );

  assert(
    /^\[functions\.send-consultation-email\]\s*\nverify_jwt\s*=\s*true\s*$/m
      .test(config),
    "send-consultation-email must have verify_jwt = true",
  );
});

Deno.test("implementation contract forbids secrets, body reads, network, database, storage, and logging", async () => {
  const source = await Deno.readTextFile(
    new URL("./index.ts", import.meta.url),
  );
  const forbidden: Array<[string, RegExp]> = [
    ["RESEND_API_KEY", /RESEND_API_KEY/i],
    ["Resend", /\bresend\b/i],
    ["fetch", /\bfetch\s*\(/],
    ["Deno.env", /\bDeno\s*\.\s*env\b/],
    ["process.env", /\bprocess\s*\.\s*env\b/],
    [
      "request body read",
      /\b(?:request|req)\s*\.\s*(?:arrayBuffer|blob|body|formData|json|text)\b/,
    ],
    ["Supabase client", /\bcreateClient\s*\(|@supabase\/supabase-js/],
    [
      "database or Storage API",
      /\.(?:delete|from|insert|remove|storage|update|upload|upsert)\s*\(/i,
    ],
    ["content logging", /\bconsole\s*\./],
  ];

  for (const [name, pattern] of forbidden) {
    assert(!pattern.test(source), `${name} is forbidden in the tombstone`);
  }
});
