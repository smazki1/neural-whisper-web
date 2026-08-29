begin;
set local search_path = public, extensions;

select plan(23);

insert into auth.users (id) values
  ('00000000-0000-0000-0000-000000000011'),
  ('00000000-0000-0000-0000-000000000012'),
  ('00000000-0000-0000-0000-000000000013'),
  ('00000000-0000-0000-0000-000000000014');

insert into public.user_roles (user_id, role) values
  ('00000000-0000-0000-0000-000000000011', 'admin');

insert into public.courses (id, user_id, title, category, level, published, is_free) values
  ('10000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000011', 'Course A', 'strategy', 'beginner', false, false),
  ('10000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000011', 'Course B', 'strategy', 'beginner', false, false),
  ('10000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000011', 'Course C', 'strategy', 'beginner', false, false);

insert into public.products (id, title, slug, category, is_published, course_id) values
  ('40000000-0000-0000-0000-000000000011', 'Product A', 'hardening-product-a', 'basic', false, '10000000-0000-0000-0000-000000000011'),
  ('40000000-0000-0000-0000-000000000012', 'Product B', 'hardening-product-b', 'basic', false, '10000000-0000-0000-0000-000000000012');

insert into public.products_courses (product_id, course_id) values
  ('40000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000011'),
  ('40000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000012');

insert into public.orders (id, user_id, product_id, total_amount, status) values
  ('50000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000012', '40000000-0000-0000-0000-000000000011', 100, 'completed'),
  ('50000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000012', '40000000-0000-0000-0000-000000000011', 100, 'pending'),
  ('50000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000012', '40000000-0000-0000-0000-000000000011', 100, 'failed'),
  ('50000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000012', '40000000-0000-0000-0000-000000000011', 100, 'refunded'),
  ('50000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000013', '40000000-0000-0000-0000-000000000012', 100, 'completed');

insert into public.entitlements (user_id, product_id, status) values
  ('00000000-0000-0000-0000-000000000014', '40000000-0000-0000-0000-000000000012', 'paid');

insert into public.user_course_access (user_id, course_id, product_id, order_id, granted_at) values
  ('00000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000012', '40000000-0000-0000-0000-000000000012', '50000000-0000-0000-0000-000000000015', '2026-01-01 00:00:00+00');

set local role anon;
select set_config('request.jwt.claim.sub', '', true);
select throws_ok(
  $$insert into public.user_course_access (user_id, course_id, product_id, order_id) values ('00000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000011', '40000000-0000-0000-0000-000000000011', '50000000-0000-0000-0000-000000000011')$$::text,
  '42501'::char(5),
  null::text,
  'anonymous insert is blocked'::text
);

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000012', true);
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000012","role":"authenticated"}', true);

select throws_ok(
  $$insert into public.orders (id, user_id, product_id, total_amount, status) values ('50000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000012', '40000000-0000-0000-0000-000000000011', 100, 'pending')$$::text,
  '42501'::char(5),
  'new row violates row-level security policy for table "orders"'::text,
  'authenticated user cannot create a pending order'::text
);
select throws_ok(
  $$insert into public.orders (id, user_id, product_id, total_amount, status) values ('50000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000012', '40000000-0000-0000-0000-000000000011', 100, 'completed')$$::text,
  '42501'::char(5),
  'new row violates row-level security policy for table "orders"'::text,
  'authenticated user cannot create a completed order'::text
);
select throws_ok(
  $$insert into public.orders (id, user_id, product_id, total_amount, status) values ('50000000-0000-0000-0000-000000000023', '00000000-0000-0000-0000-000000000012', '40000000-0000-0000-0000-000000000011', 100, 'failed')$$::text,
  '42501'::char(5),
  'new row violates row-level security policy for table "orders"'::text,
  'authenticated user cannot create a failed order'::text
);
select throws_ok(
  $$insert into public.orders (id, user_id, product_id, total_amount, status) values ('50000000-0000-0000-0000-000000000024', '00000000-0000-0000-0000-000000000012', '40000000-0000-0000-0000-000000000011', 100, 'refunded')$$::text,
  '42501'::char(5),
  'new row violates row-level security policy for table "orders"'::text,
  'authenticated user cannot create a refunded order'::text
);
select is(
  (
    select count(*)
    from pg_policies
    where schemaname = 'public'
      and tablename = 'orders'
      and cmd = 'INSERT'
  ),
  0::bigint,
  'orders has no direct INSERT policy after hardening'
);

select throws_ok(
  $$insert into public.user_course_access (user_id, course_id, product_id, order_id) values ('00000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000011', '40000000-0000-0000-0000-000000000011', '50000000-0000-0000-0000-000000000012')$$::text,
  '42501'::char(5), null::text, 'pending order is blocked'::text
);
select throws_ok(
  $$insert into public.user_course_access (user_id, course_id, product_id, order_id) values ('00000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000011', '40000000-0000-0000-0000-000000000011', '50000000-0000-0000-0000-000000000013')$$::text,
  '42501'::char(5), null::text, 'failed order is blocked'::text
);
select throws_ok(
  $$insert into public.user_course_access (user_id, course_id, product_id, order_id) values ('00000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000011', '40000000-0000-0000-0000-000000000011', '50000000-0000-0000-0000-000000000014')$$::text,
  '42501'::char(5), null::text, 'refunded order is blocked'::text
);
select throws_ok(
  $$insert into public.user_course_access (user_id, course_id, product_id, order_id) values ('00000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000012', '40000000-0000-0000-0000-000000000012', '50000000-0000-0000-0000-000000000015')$$::text,
  '42501'::char(5), null::text, 'another user order is blocked'::text
);
select throws_ok(
  $$insert into public.user_course_access (user_id, course_id, product_id, order_id) values ('00000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000012', '40000000-0000-0000-0000-000000000012', '50000000-0000-0000-0000-000000000011')$$::text,
  '42501'::char(5), null::text, 'product mismatch is blocked'::text
);
select throws_ok(
  $$insert into public.user_course_access (user_id, course_id, product_id, order_id) values ('00000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000012', '40000000-0000-0000-0000-000000000011', '50000000-0000-0000-0000-000000000011')$$::text,
  '42501'::char(5), null::text, 'unmapped course is blocked'::text
);

select throws_ok(
  $$insert into public.user_course_access (user_id, course_id, product_id, order_id) values
      ('00000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000011', '40000000-0000-0000-0000-000000000011', '50000000-0000-0000-0000-000000000011'),
      ('00000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000013', '40000000-0000-0000-0000-000000000011', '50000000-0000-0000-0000-000000000011')$$::text,
  '42501'::char(5),
  null::text,
  'mixed-validity multi-row insert is rejected atomically'::text
);
select is(
  (
    select count(*)
    from public.user_course_access
    where user_id = '00000000-0000-0000-0000-000000000012'
      and course_id in (
        '10000000-0000-0000-0000-000000000011',
        '10000000-0000-0000-0000-000000000013'
      )
  ),
  0::bigint,
  'failed multi-row insert leaves no partial course access'
);

select lives_ok(
  $$insert into public.user_course_access (user_id, course_id, product_id, order_id, granted_at) values ('00000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000011', '40000000-0000-0000-0000-000000000011', '50000000-0000-0000-0000-000000000011', '2026-02-01 00:00:00+00')$$,
  'completed own order grants its exact mapped course'
);
select is(
  (select count(*) from public.user_course_access where user_id = '00000000-0000-0000-0000-000000000012'),
  1::bigint,
  'exact grant creates one row'
);

select throws_ok(
  $$insert into public.user_course_access (user_id, course_id, product_id, order_id, granted_at) values ('00000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000011', '40000000-0000-0000-0000-000000000011', '50000000-0000-0000-0000-000000000011', now())$$::text,
  '23505'::char(5),
  null::text,
  'database uniqueness rejects a duplicate concurrent grant'::text
);
select is(
  (select granted_at from public.user_course_access where user_id = '00000000-0000-0000-0000-000000000012' and course_id = '10000000-0000-0000-0000-000000000011'),
  '2026-02-01 00:00:00+00'::timestamptz,
  'replay does not change granted_at'
);
select is(
  (select count(*) from public.user_course_access where user_id = '00000000-0000-0000-0000-000000000012' and course_id = '10000000-0000-0000-0000-000000000011'),
  1::bigint,
  'replay does not create a duplicate row'
);

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000011', true);
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000011","role":"authenticated"}', true);
select lives_ok(
  $$insert into public.user_course_access (user_id, course_id, product_id, order_id) values ('00000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000013', '40000000-0000-0000-0000-000000000012', '50000000-0000-0000-0000-000000000012')$$,
  'admin insert policy remains effective'
);

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000013', true);
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000013","role":"authenticated"}', true);
select is(
  (select count(*) from public.courses where id = '10000000-0000-0000-0000-000000000012'),
  1::bigint,
  'legacy course access remains readable'
);

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000014', true);
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000014","role":"authenticated"}', true);
select is(
  (select count(*) from public.courses where id = '10000000-0000-0000-0000-000000000012'),
  1::bigint,
  'paid entitlement course access is unaffected'
);

reset role;
select is(
  (
    select count(*)
    from pg_policies
    where schemaname = 'public'
      and tablename = 'user_course_access'
      and policyname = 'Admins can insert course access'
      and cmd = 'INSERT'
  ),
  1::bigint,
  'admin insert policy remains present'
);

select * from finish();
rollback;
