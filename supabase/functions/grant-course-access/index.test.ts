import { createHandler } from "./index.ts";

const orderId = "50000000-0000-0000-0000-000000000001";
const userId = "00000000-0000-0000-0000-000000000002";
const productId = "40000000-0000-0000-0000-000000000001";
const courseId = "10000000-0000-0000-0000-000000000001";
const courseId2 = "10000000-0000-0000-0000-000000000002";
const courseId3 = "10000000-0000-0000-0000-000000000003";

type QueryResult = { data: unknown; error: null | { code?: string } };

type Scenario = {
  auth?: QueryResult;
  order?: QueryResult;
  courses?: QueryResult;
  insertResults?: QueryResult[];
  existingReads?: QueryResult[];
};

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

const request = (init: RequestInit = {}) =>
  new Request("http://localhost/grant-course-access", {
    method: "POST",
    headers: {
      Authorization: "Bearer user-token",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ orderId }),
    ...init,
  });

const access = (
  course_id: string,
  overrides: Record<string, unknown> = {},
) => ({
  user_id: userId,
  course_id,
  product_id: productId,
  order_id: orderId,
  granted_at: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

const query = (
  result: QueryResult | (() => QueryResult | Promise<QueryResult>),
  filters: unknown[][],
) => {
  const getResult = () => typeof result === "function" ? result() : result;
  const builder = {
    select: () => builder,
    eq: (...args: unknown[]) => {
      filters.push(args);
      return builder;
    },
    in: (...args: unknown[]) => {
      filters.push(args);
      return builder;
    },
    maybeSingle: () => Promise.resolve(getResult()),
    then: (
      resolve: (value: QueryResult) => unknown,
      reject: (reason: unknown) => unknown,
    ) => Promise.resolve(getResult()).then(resolve, reject),
  };
  return builder;
};

const mockFactory = (scenario: Scenario = {}) => {
  const filters: Record<string, unknown[][]> = {
    orders: [],
    products_courses: [],
    user_course_access: [],
  };
  const inserts: unknown[] = [];
  const existingQueries: unknown[][][] = [];
  const factoryCalls: unknown[][] = [];
  const insertResults = [
    ...(scenario.insertResults ?? [{ data: null, error: null }]),
  ];
  const existingReads = [
    ...(scenario.existingReads ?? [{ data: [], error: null }]),
  ];

  const client = {
    auth: {
      getUser: () =>
        Promise.resolve(
          scenario.auth ?? {
            data: { user: { id: userId } },
            error: null,
          },
        ),
    },
    from: (table: string) => {
      if (table === "orders") {
        return query(
          scenario.order ?? {
            data: { id: orderId, product_id: productId },
            error: null,
          },
          filters.orders,
        );
      }
      if (table === "products_courses") {
        return query(
          scenario.courses ?? {
            data: [{ course_id: courseId }],
            error: null,
          },
          filters.products_courses,
        );
      }
      if (table === "user_course_access") {
        return {
          insert: (payload: unknown) => {
            inserts.push(payload);
            return Promise.resolve(
              insertResults.shift() ?? { data: null, error: null },
            );
          },
          select: () => {
            const queryFilters: unknown[][] = [];
            existingQueries.push(queryFilters);
            return query(
              () => existingReads.shift() ?? { data: [], error: null },
              queryFilters,
            );
          },
        };
      }
      throw new Error(`Unexpected table: ${table}`);
    },
  };

  const factory = (...args: unknown[]) => {
    factoryCalls.push(args);
    return client;
  };

  return {
    factory: factory as unknown as Parameters<typeof createHandler>[0],
    factoryCalls,
    filters,
    inserts,
    existingQueries,
  };
};

Deno.env.set("SUPABASE_URL", "https://project.supabase.test");
Deno.env.set("SUPABASE_ANON_KEY", "anon-key");

Deno.test("allows only OPTIONS and POST", async () => {
  const mock = mockFactory();
  const handler = createHandler(mock.factory);
  const options = await handler(request({ method: "OPTIONS", body: null }));
  const get = await handler(request({ method: "GET", body: null }));
  assertEquals(options.status, 204);
  assertEquals(get.status, 405);
  assertEquals(get.headers.get("Allow"), "POST, OPTIONS");
});

Deno.test("blocks anonymous and invalid users", async () => {
  const anonymous = mockFactory();
  const anonymousResponse = await createHandler(anonymous.factory)(
    request({ headers: {} }),
  );
  assertEquals(anonymousResponse.status, 401);
  assertEquals(anonymous.factoryCalls.length, 0);

  const invalid = mockFactory({
    auth: { data: { user: null }, error: { code: "bad_jwt" } },
  });
  const invalidResponse = await createHandler(invalid.factory)(request());
  assertEquals(invalidResponse.status, 401);
});

Deno.test("rejects malformed order identifiers", async () => {
  const mock = mockFactory();
  const response = await createHandler(mock.factory)(
    request({ body: JSON.stringify({ orderId: "not-a-uuid" }) }),
  );
  assertEquals(response.status, 400);
});

Deno.test("uses the user JWT and hard-filters completed orders owned by that user", async () => {
  const mock = mockFactory();
  const response = await createHandler(mock.factory)(request());
  assertEquals(response.status, 200);
  assertEquals(mock.factoryCalls[0][1], "anon-key");
  assertEquals(mock.factoryCalls[0][2], {
    global: { headers: { Authorization: "Bearer user-token" } },
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
  assertEquals(mock.filters.orders, [
    ["id", orderId],
    ["user_id", userId],
    ["status", "completed"],
  ]);
  assertEquals(mock.inserts, [[{
    user_id: userId,
    course_id: courseId,
    product_id: productId,
    order_id: orderId,
  }]]);
  assertEquals(mock.existingQueries, [[
    ["user_id", userId],
    ["course_id", [courseId]],
  ]]);
  assert(
    !("granted_at" in (mock.inserts[0] as Record<string, unknown>[])[0]),
  );
});

Deno.test("returns the same denial for missing, cross-user, pending, failed, and refunded orders", async () => {
  const responses = await Promise.all(
    ["missing", "cross-user", "pending", "failed", "refunded"].map(async () => {
      const mock = mockFactory({ order: { data: null, error: null } });
      const response = await createHandler(mock.factory)(request());
      return { status: response.status, body: await response.text() };
    }),
  );
  assert(responses.every((response) => response.status === 403));
  assert(responses.every((response) => response.body === responses[0].body));
});

Deno.test("returns generic failures for Supabase lookup errors", async () => {
  const orderFailure = mockFactory({
    order: { data: null, error: { code: "orders_unavailable" } },
  });
  const orderResponse = await createHandler(orderFailure.factory)(request());
  assertEquals(orderResponse.status, 500);
  assertEquals(await orderResponse.json(), { error: "Internal server error" });

  const mappingFailure = mockFactory({
    courses: { data: null, error: { code: "mappings_unavailable" } },
  });
  const mappingResponse = await createHandler(mappingFailure.factory)(
    request(),
  );
  assertEquals(mappingResponse.status, 500);
  assertEquals(await mappingResponse.json(), {
    error: "Internal server error",
  });
});

Deno.test("a failed bulk write is not retried as separate course inserts", async () => {
  const mock = mockFactory({
    courses: {
      data: [{ course_id: courseId }, { course_id: courseId2 }],
      error: null,
    },
    insertResults: [{ data: null, error: { code: "42501" } }],
  });
  const response = await createHandler(mock.factory)(request());
  assertEquals(response.status, 500);
  assertEquals(await response.json(), { error: "Internal server error" });
  assertEquals(mock.inserts.length, 1);
  assertEquals((mock.inserts[0] as unknown[]).length, 2);
});

Deno.test("accepts a concurrent unique conflict only after every course matches", async () => {
  const mock = mockFactory({
    courses: {
      data: [{ course_id: courseId }, { course_id: courseId2 }],
      error: null,
    },
    insertResults: [{ data: null, error: { code: "23505" } }],
    existingReads: [
      { data: [], error: null },
      { data: [access(courseId), access(courseId2)], error: null },
    ],
  });
  const response = await createHandler(mock.factory)(request());
  assertEquals(response.status, 200);
  assertEquals(mock.inserts.length, 1);
  assertEquals(mock.existingQueries.length, 2);
});

Deno.test("retries one bulk insert for courses still missing after a conflict", async () => {
  const priorAccess = access(courseId, {
    product_id: "40000000-0000-0000-0000-000000000099",
    order_id: "50000000-0000-0000-0000-000000000099",
  });
  const concurrentlyGranted = access(courseId2, {
    product_id: "40000000-0000-0000-0000-000000000098",
    order_id: "50000000-0000-0000-0000-000000000098",
  });
  const mock = mockFactory({
    courses: {
      data: [
        { course_id: courseId },
        { course_id: courseId2 },
        { course_id: courseId3 },
      ],
      error: null,
    },
    insertResults: [
      { data: null, error: { code: "23505" } },
      { data: null, error: null },
    ],
    existingReads: [
      { data: [priorAccess], error: null },
      { data: [priorAccess, concurrentlyGranted], error: null },
    ],
  });

  const response = await createHandler(mock.factory)(request());

  assertEquals(response.status, 200);
  assertEquals(mock.inserts, [
    [
      {
        user_id: userId,
        course_id: courseId2,
        product_id: productId,
        order_id: orderId,
      },
      {
        user_id: userId,
        course_id: courseId3,
        product_id: productId,
        order_id: orderId,
      },
    ],
    [{
      user_id: userId,
      course_id: courseId3,
      product_id: productId,
      order_id: orderId,
    }],
  ]);
});

Deno.test("verifies all courses after a second concurrent unique conflict", async () => {
  const mock = mockFactory({
    courses: {
      data: [{ course_id: courseId }, { course_id: courseId2 }],
      error: null,
    },
    insertResults: [
      { data: null, error: { code: "23505" } },
      { data: null, error: { code: "23505" } },
    ],
    existingReads: [
      { data: [], error: null },
      { data: [access(courseId)], error: null },
      { data: [access(courseId), access(courseId2)], error: null },
    ],
  });

  const response = await createHandler(mock.factory)(request());

  assertEquals(response.status, 200);
  assertEquals(mock.inserts.length, 2);
  assertEquals(mock.existingQueries.length, 3);
});

Deno.test("rejects a second unique conflict when a course is still missing", async () => {
  const mock = mockFactory({
    courses: {
      data: [{ course_id: courseId }, { course_id: courseId2 }],
      error: null,
    },
    insertResults: [
      { data: null, error: { code: "23505" } },
      { data: null, error: { code: "23505" } },
    ],
    existingReads: [
      { data: [], error: null },
      { data: [access(courseId)], error: null },
      { data: [access(courseId)], error: null },
    ],
  });

  const response = await createHandler(mock.factory)(request());

  assertEquals(response.status, 500);
  assertEquals(mock.inserts.length, 2);
  assertEquals(mock.existingQueries.length, 3);
});

Deno.test("bulk inserts two unique mapped courses in one operation", async () => {
  const mock = mockFactory({
    courses: {
      data: [
        { course_id: courseId },
        { course_id: courseId2 },
        { course_id: courseId },
      ],
      error: null,
    },
  });
  const response = await createHandler(mock.factory)(request());
  assertEquals(response.status, 200);
  assertEquals(mock.inserts, [[
    {
      user_id: userId,
      course_id: courseId,
      product_id: productId,
      order_id: orderId,
    },
    {
      user_id: userId,
      course_id: courseId2,
      product_id: productId,
      order_id: orderId,
    },
  ]]);
});

Deno.test("preserves prior audit while granting an overlapping product", async () => {
  const existing = access(courseId, {
    product_id: "40000000-0000-0000-0000-000000000099",
    order_id: "50000000-0000-0000-0000-000000000099",
  });
  const existingSnapshot = JSON.stringify(existing);
  const newlyGranted = access(courseId2, {
    granted_at: "2026-02-01T00:00:00.000Z",
  });
  const mock = mockFactory({
    courses: {
      data: [{ course_id: courseId }, { course_id: courseId2 }],
      error: null,
    },
    existingReads: [
      { data: [existing], error: null },
      { data: [existing, newlyGranted], error: null },
    ],
  });

  const firstResponse = await createHandler(mock.factory)(request());
  assertEquals(firstResponse.status, 200);
  assertEquals(mock.inserts, [[{
    user_id: userId,
    course_id: courseId2,
    product_id: productId,
    order_id: orderId,
  }]]);
  assertEquals(JSON.stringify(existing), existingSnapshot);

  const replayResponse = await createHandler(mock.factory)(request());
  assertEquals(replayResponse.status, 200);
  assertEquals(mock.inserts.length, 1);
  assertEquals(JSON.stringify(existing), existingSnapshot);
  assertEquals(newlyGranted.granted_at, "2026-02-01T00:00:00.000Z");
});

Deno.test("a full replay performs no write and preserves granted_at", async () => {
  const existing = [access(courseId), access(courseId2)];
  const snapshot = JSON.stringify(existing);
  const mock = mockFactory({
    courses: {
      data: [{ course_id: courseId }, { course_id: courseId2 }],
      error: null,
    },
    existingReads: [{ data: existing, error: null }],
  });
  const response = await createHandler(mock.factory)(request());
  assertEquals(response.status, 200);
  assertEquals(mock.inserts.length, 0);
  assertEquals(JSON.stringify(existing), snapshot);
});

Deno.test("two concurrent calls create one complete logical course set", async () => {
  const stored = new Map<string, Record<string, unknown>>();
  let preflightReads = 0;
  let releasePreflights: (() => void) | undefined;
  const preflightsReady = new Promise<void>((resolve) => {
    releasePreflights = resolve;
  });

  const dynamicQuery = () => {
    const builder = {
      select: () => builder,
      eq: () => builder,
      in: () => builder,
      maybeSingle: () => Promise.resolve({ data: null, error: null }),
      then: async (
        resolve: (value: QueryResult) => unknown,
        reject: (reason: unknown) => unknown,
      ) => {
        try {
          if (preflightReads < 2) {
            preflightReads += 1;
            if (preflightReads === 2) releasePreflights?.();
            await preflightsReady;
            return resolve({ data: [], error: null });
          }
          return resolve({ data: [...stored.values()], error: null });
        } catch (error) {
          return reject(error);
        }
      },
    };
    return builder;
  };

  let successfulBulkWrites = 0;
  const sharedFactory = (() => ({
    auth: {
      getUser: () =>
        Promise.resolve({ data: { user: { id: userId } }, error: null }),
    },
    from: (table: string) => {
      if (table === "orders") {
        return query({
          data: { id: orderId, product_id: productId },
          error: null,
        }, []);
      }
      if (table === "products_courses") {
        return query({
          data: [{ course_id: courseId }, { course_id: courseId2 }],
          error: null,
        }, []);
      }
      return {
        insert: (rows: Record<string, unknown>[]) => {
          if (stored.size > 0) {
            return Promise.resolve({ data: null, error: { code: "23505" } });
          }
          successfulBulkWrites += 1;
          for (const row of rows) stored.set(String(row.course_id), row);
          return Promise.resolve({ data: null, error: null });
        },
        select: dynamicQuery,
      };
    },
  })) as unknown as Parameters<typeof createHandler>[0];

  const handler = createHandler(sharedFactory);
  const responses = await Promise.all([handler(request()), handler(request())]);
  assertEquals(responses.map(({ status }) => status), [200, 200]);
  assertEquals(successfulBulkWrites, 1);
  assertEquals([...stored.keys()].sort(), [courseId, courseId2]);
});
