import { createHandler } from "./index.ts";

const orderId = "50000000-0000-0000-0000-000000000001";
const userId = "00000000-0000-0000-0000-000000000002";
const productId = "40000000-0000-0000-0000-000000000001";
const courseId = "10000000-0000-0000-0000-000000000001";

type QueryResult = { data: unknown; error: null | { code?: string } };

type Scenario = {
  auth?: QueryResult;
  order?: QueryResult;
  courses?: QueryResult;
  insert?: QueryResult;
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
              scenario.insert ?? { data: null, error: null },
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
  assertEquals(mock.inserts, [{
    user_id: userId,
    course_id: courseId,
    product_id: productId,
    order_id: orderId,
  }]);
  assertEquals(mock.existingQueries, []);
  assert(!("granted_at" in (mock.inserts[0] as Record<string, unknown>)));
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

Deno.test("does not return success when a database write fails", async () => {
  const mock = mockFactory({
    insert: { data: null, error: { code: "42501" } },
  });
  const response = await createHandler(mock.factory)(request());
  assertEquals(response.status, 500);
  assertEquals(await response.json(), { error: "Internal server error" });
});

Deno.test("treats a verified unique conflict as replay without updating audit fields", async () => {
  const mock = mockFactory({
    insert: { data: null, error: { code: "23505" } },
    existingReads: [{
      data: { id: "60000000-0000-0000-0000-000000000001" },
      error: null,
    }],
  });
  const response = await createHandler(mock.factory)(request());
  assertEquals(response.status, 200);
  assertEquals(mock.inserts.length, 1);
  assert(!("granted_at" in (mock.inserts[0] as Record<string, unknown>)));
  assertEquals(mock.existingQueries, [[
    ["user_id", userId],
    ["course_id", courseId],
  ]]);
});

Deno.test("does not accept an unverified unique conflict as replay", async () => {
  const mock = mockFactory({
    insert: { data: null, error: { code: "23505" } },
    existingReads: [{ data: null, error: null }],
  });
  const response = await createHandler(mock.factory)(request());
  assertEquals(response.status, 500);
  assertEquals(await response.json(), { error: "Internal server error" });
});

Deno.test("keeps prior course audit when a new product grants another course", async () => {
  const secondCourseId = "10000000-0000-0000-0000-000000000002";
  const newOrderId = "50000000-0000-0000-0000-000000000002";
  const newProductId = "40000000-0000-0000-0000-000000000002";
  type AccessRow = {
    id: string;
    user_id: string;
    course_id: string;
    product_id: string;
    order_id: string;
    granted_at: string;
  };
  const priorAccess: AccessRow = {
    id: "60000000-0000-0000-0000-000000000001",
    user_id: userId,
    course_id: courseId,
    product_id: "40000000-0000-0000-0000-000000000099",
    order_id: "50000000-0000-0000-0000-000000000099",
    granted_at: "2026-01-01T00:00:00.000Z",
  };
  const accessRows = new Map<string, AccessRow>([
    [`${userId}:${courseId}`, { ...priorAccess }],
  ]);

  const accessQuery = () => {
    const filters = new Map<string, unknown>();
    const builder = {
      select: () => builder,
      eq: (column: string, value: unknown) => {
        filters.set(column, value);
        return builder;
      },
      maybeSingle: () => {
        const row = accessRows.get(
          `${filters.get("user_id")}:${filters.get("course_id")}`,
        );
        return Promise.resolve({ data: row ?? null, error: null });
      },
    };
    return builder;
  };

  const factory = (() => ({
    auth: {
      getUser: () =>
        Promise.resolve({ data: { user: { id: userId } }, error: null }),
    },
    from: (table: string) => {
      if (table === "orders") {
        return query({
          data: { id: newOrderId, product_id: newProductId },
          error: null,
        }, []);
      }
      if (table === "products_courses") {
        return query({
          data: [{ course_id: courseId }, { course_id: secondCourseId }],
          error: null,
        }, []);
      }
      return {
        insert: (payload: Record<string, string>) => {
          const key = `${payload.user_id}:${payload.course_id}`;
          if (accessRows.has(key)) {
            return Promise.resolve({ data: null, error: { code: "23505" } });
          }
          accessRows.set(key, {
            id: "60000000-0000-0000-0000-000000000002",
            user_id: payload.user_id,
            course_id: payload.course_id,
            product_id: payload.product_id,
            order_id: payload.order_id,
            granted_at: "2026-02-01T00:00:00.000Z",
          });
          return Promise.resolve({ data: null, error: null });
        },
        select: accessQuery,
      };
    },
  })) as unknown as Parameters<typeof createHandler>[0];

  const handler = createHandler(factory);
  const newOrderRequest = () =>
    request({ body: JSON.stringify({ orderId: newOrderId }) });
  const priorSnapshot = JSON.stringify(priorAccess);

  const firstResponse = await handler(newOrderRequest());
  assertEquals(firstResponse.status, 200);
  assertEquals(
    JSON.stringify(accessRows.get(`${userId}:${courseId}`)),
    priorSnapshot,
  );
  assertEquals(accessRows.get(`${userId}:${secondCourseId}`), {
    id: "60000000-0000-0000-0000-000000000002",
    user_id: userId,
    course_id: secondCourseId,
    product_id: newProductId,
    order_id: newOrderId,
    granted_at: "2026-02-01T00:00:00.000Z",
  });

  const secondGrantedAt = accessRows.get(`${userId}:${secondCourseId}`)
    ?.granted_at;
  const replayResponse = await handler(newOrderRequest());
  assertEquals(replayResponse.status, 200);
  assertEquals(
    JSON.stringify(accessRows.get(`${userId}:${courseId}`)),
    priorSnapshot,
  );
  assertEquals(
    accessRows.get(`${userId}:${secondCourseId}`)?.granted_at,
    secondGrantedAt,
  );
  assertEquals(accessRows.size, 2);
});

Deno.test("two concurrent calls rely on uniqueness and produce one logical grant", async () => {
  let exists = false;
  let logicalRows = 0;
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
        return query({ data: [{ course_id: courseId }], error: null }, []);
      }
      return {
        insert: () => {
          if (exists) {
            return Promise.resolve({ data: null, error: { code: "23505" } });
          }
          exists = true;
          logicalRows += 1;
          return Promise.resolve({ data: null, error: null });
        },
        select: () =>
          query({ data: exists ? { id: "existing" } : null, error: null }, []),
      };
    },
  })) as unknown as Parameters<typeof createHandler>[0];

  const handler = createHandler(sharedFactory);
  const responses = await Promise.all([handler(request()), handler(request())]);
  assertEquals(responses.map(({ status }) => status), [200, 200]);
  assertEquals(logicalRows, 1);
});
