begin;

select plan(10);

select ok(
  to_regprocedure('public.create_payment_intent_limited(uuid,numeric,text)') is not null,
  'atomic payment intent creation function exists'
);

select ok(
  has_function_privilege(
    'service_role',
    'public.create_payment_intent_limited(uuid,numeric,text)',
    'EXECUTE'
  ),
  'service role can create a payment intent through the protected function'
);

select ok(
  not has_function_privilege(
    'anon',
    'public.create_payment_intent_limited(uuid,numeric,text)',
    'EXECUTE'
  ),
  'anonymous callers cannot execute payment intent creation'
);

select ok(
  not has_function_privilege(
    'authenticated',
    'public.create_payment_intent_limited(uuid,numeric,text)',
    'EXECUTE'
  ),
  'authenticated callers cannot execute payment intent creation directly'
);

insert into public.products (
  id,
  title,
  slug,
  price,
  product_type,
  is_published
)
values (
  '00000000-0000-0000-0000-000000000200',
  'Payment intent test product',
  'payment-intent-test-product',
  100,
  'course',
  true
);

insert into public.payment_intents (
  id,
  product_id,
  expected_amount,
  request_fingerprint,
  expires_at
)
values (
  '00000000-0000-0000-0000-000000000201',
  '00000000-0000-0000-0000-000000000200',
  100,
  repeat('a', 64),
  pg_catalog.now() - interval '1 minute'
);

set local role service_role;

select lives_ok(
  $$select public.create_payment_intent_limited(
    '00000000-0000-0000-0000-000000000200',
    100,
    repeat('a', 64)
  )$$,
  'service role creates the first payment intent'
);

reset role;

select is(
  (
    select count(*)
    from public.payment_intents
    where id = '00000000-0000-0000-0000-000000000201'
  ),
  0::bigint,
  'expired pending payment intents are removed atomically'
);

set local role service_role;

select lives_ok(
  $$select public.create_payment_intent_limited(
    '00000000-0000-0000-0000-000000000200',
    100,
    repeat('a', 64)
  ) from generate_series(1, 4)$$,
  'four more payment intents remain within the ten-minute limit'
);

reset role;

select is(
  (
    select count(*)
    from public.payment_intents
    where product_id = '00000000-0000-0000-0000-000000000200'
      and request_fingerprint = repeat('a', 64)
  ),
  5::bigint,
  'exactly five recent payment intents exist for the fingerprint and product'
);

set local role service_role;

select throws_ok(
  $$select public.create_payment_intent_limited(
    '00000000-0000-0000-0000-000000000200',
    100,
    repeat('a', 64)
  )$$,
  'P0001',
  'rate_limited',
  'the sixth payment intent is rejected'
);

select throws_ok(
  $$select public.create_payment_intent_limited(
    '00000000-0000-0000-0000-000000000200',
    100,
    'not-a-valid-fingerprint'
  )$$,
  '22023',
  'invalid_request_fingerprint',
  'malformed request fingerprints are rejected'
);

select * from finish();

rollback;
