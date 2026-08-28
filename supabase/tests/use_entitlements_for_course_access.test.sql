begin;

select plan(23);

insert into auth.users (id) values
  ('00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000003'),
  ('00000000-0000-0000-0000-000000000004'),
  ('00000000-0000-0000-0000-000000000005'),
  ('00000000-0000-0000-0000-000000000006'),
  ('00000000-0000-0000-0000-000000000007'),
  ('00000000-0000-0000-0000-000000000008');

insert into public.user_roles (user_id, role) values
  ('00000000-0000-0000-0000-000000000001', 'admin');

insert into public.courses (id, user_id, title, category, level, published, is_free) values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Paid course A', 'strategy', 'beginner', false, false),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Paid course B', 'strategy', 'beginner', false, false),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Public free course', 'strategy', 'beginner', true, true),
  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Published paid preview course', 'strategy', 'beginner', true, false);

insert into public.modules (id, course_id, title) values
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Module A'),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'Module B'),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 'Free module'),
  ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004', 'Preview module');

insert into public.lessons (id, module_id, title, is_preview) values
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Lesson A', false),
  ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'Lesson B', false),
  ('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', 'Free lesson', false),
  ('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000004', 'Preview lesson', true),
  ('30000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000004', 'Locked paid lesson', false);

insert into public.products (id, title, slug, is_published, course_id) values
  ('40000000-0000-0000-0000-000000000001', 'Product A', 'product-a', true, '10000000-0000-0000-0000-000000000001'),
  ('40000000-0000-0000-0000-000000000002', 'Product B', 'product-b', true, '10000000-0000-0000-0000-000000000002'),
  ('40000000-0000-0000-0000-000000000003', 'Product without course', 'product-without-course', true, null);

insert into public.entitlements (user_id, product_id, status) values
  ('00000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001', 'paid'),
  ('00000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000001', 'pending'),
  ('00000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000001', 'failed'),
  ('00000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000001', 'refunded'),
  ('00000000-0000-0000-0000-000000000008', '40000000-0000-0000-0000-000000000003', 'paid');

insert into public.orders (id, product_id, total_amount) values
  ('50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000002', 100);

insert into public.user_course_access (user_id, course_id, product_id, order_id) values
  ('00000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000001');

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000002', true);
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000002","role":"authenticated"}', true);

select is((select count(*) from public.courses where id = '10000000-0000-0000-0000-000000000001'), 1::bigint, 'paid entitlement reads course A');
select is((select count(*) from public.modules where course_id = '10000000-0000-0000-0000-000000000001'), 1::bigint, 'paid entitlement reads modules of course A');
select is((select count(*) from public.lessons where module_id = '20000000-0000-0000-0000-000000000001'), 1::bigint, 'paid entitlement reads lessons of course A');
select is((select count(*) from public.courses where id = '10000000-0000-0000-0000-000000000002'), 0::bigint, 'entitlement for A does not read private course B');
select is((select count(*) from public.modules where course_id = '10000000-0000-0000-0000-000000000002'), 0::bigint, 'entitlement for A does not read modules of B');
select is((select count(*) from public.lessons where module_id = '20000000-0000-0000-0000-000000000002'), 0::bigint, 'entitlement for A does not read lessons of B');

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000003', true);
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000003","role":"authenticated"}', true);
select is((select count(*) from public.lessons where id = '30000000-0000-0000-0000-000000000001'), 0::bigint, 'user without entitlement cannot read a paid lesson');

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000004', true);
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000004","role":"authenticated"}', true);
select is((select count(*) from public.lessons where id = '30000000-0000-0000-0000-000000000001'), 0::bigint, 'pending entitlement does not grant access');

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000005', true);
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000005","role":"authenticated"}', true);
select is((select count(*) from public.lessons where id = '30000000-0000-0000-0000-000000000001'), 0::bigint, 'failed entitlement does not grant access');

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000006', true);
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000006","role":"authenticated"}', true);
select is((select count(*) from public.lessons where id = '30000000-0000-0000-0000-000000000001'), 0::bigint, 'refunded entitlement does not grant access');

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000008', true);
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000008","role":"authenticated"}', true);
select is((select count(*) from public.lessons where id = '30000000-0000-0000-0000-000000000001'), 0::bigint, 'paid entitlement whose product has no course_id grants no course access');

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000007', true);
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000007","role":"authenticated"}', true);
select is((select count(*) from public.courses where id = '10000000-0000-0000-0000-000000000002'), 1::bigint, 'legacy user_course_access reads course B');
select is((select count(*) from public.modules where course_id = '10000000-0000-0000-0000-000000000002'), 1::bigint, 'legacy user_course_access reads modules of B');
select is((select count(*) from public.lessons where module_id = '20000000-0000-0000-0000-000000000002'), 1::bigint, 'legacy user_course_access reads lessons of B');

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000001","role":"authenticated"}', true);
select is(
  (select count(*) from public.courses where id = '10000000-0000-0000-0000-000000000002')
  + (select count(*) from public.modules where id = '20000000-0000-0000-0000-000000000002')
  + (select count(*) from public.lessons where id = '30000000-0000-0000-0000-000000000002'),
  3::bigint,
  'admin reads private course content'
);
select lives_ok(
  $$update public.lessons set title = 'Admin edit' where id = '30000000-0000-0000-0000-000000000002'$$,
  'admin can edit lesson content'
);
select is((select title from public.lessons where id = '30000000-0000-0000-0000-000000000002'), 'Admin edit', 'admin edit is visible');

reset role;
set local role anon;
select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claims', '{"role":"anon"}', true);
select is((select count(*) from public.courses where id = '10000000-0000-0000-0000-000000000003'), 1::bigint, 'public free course remains readable');
select is((select count(*) from public.modules where id = '20000000-0000-0000-0000-000000000003'), 1::bigint, 'public free module remains readable');
select is((select count(*) from public.lessons where id = '30000000-0000-0000-0000-000000000003'), 1::bigint, 'public free lesson remains readable');
select is((select count(*) from public.lessons where id = '30000000-0000-0000-0000-000000000005'), 0::bigint, 'non-preview paid lesson remains private');

reset role;
select ok(
  exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'lessons'
      and policyname = 'Public can view free or preview lessons'
      and qual ilike '%is_preview = true%'
  ),
  'preview SELECT rule remains present'
);
select is(
  (
    select count(*)
    from pg_policies
    where schemaname = 'public'
      and tablename in ('courses', 'modules', 'lessons')
      and cmd in ('INSERT', 'UPDATE', 'DELETE')
      and policyname in (
        'Admins can insert courses', 'Admins can update courses', 'Admins can delete courses',
        'Admins can insert modules', 'Admins can update modules', 'Admins can delete modules',
        'Admins can insert lessons', 'Admins can update lessons', 'Admins can delete lessons'
      )
  ),
  9::bigint,
  'all PR #9 admin write policies remain present'
);

select * from finish();
rollback;
