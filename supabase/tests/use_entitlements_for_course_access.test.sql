begin;

select plan(36);

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
  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Published locked paid course', 'strategy', 'beginner', true, false);

insert into public.modules (id, course_id, title) values
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Module A'),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'Module B'),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 'Free module'),
  ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004', 'Locked module');

insert into public.lessons (id, module_id, title) values
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Lesson A'),
  ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'Lesson B'),
  ('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', 'Free lesson'),
  ('30000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000004', 'Locked paid lesson');

insert into public.resources (id, lesson_id, type, label, url) values
  ('35000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'pdf', 'Resource A', 'https://example.test/course-a.pdf'),
  ('35000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', 'pdf', 'Resource B', 'https://example.test/course-b.pdf'),
  ('35000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000003', 'pdf', 'Free resource', 'https://example.test/free.pdf'),
  ('35000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000005', 'pdf', 'Locked resource', 'https://example.test/locked.pdf');

insert into public.products (id, title, slug, category, is_published, course_id) values
  ('40000000-0000-0000-0000-000000000001', 'Product A', 'product-a', 'basic', false, '10000000-0000-0000-0000-000000000001'),
  ('40000000-0000-0000-0000-000000000002', 'Product B', 'product-b', 'basic', false, '10000000-0000-0000-0000-000000000002'),
  ('40000000-0000-0000-0000-000000000003', 'Product without course', 'product-without-course', 'basic', false, null);

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

select is((select count(*) from public.products where id = '40000000-0000-0000-0000-000000000001'), 1::bigint, 'paid entitlement reads its unpublished product');
select is((select count(*) from public.products where id = '40000000-0000-0000-0000-000000000002'), 0::bigint, 'paid entitlement does not read another unpublished product');
select is((select count(*) from public.courses where id = '10000000-0000-0000-0000-000000000001'), 1::bigint, 'paid entitlement reads course A');
select is((select count(*) from public.modules where course_id = '10000000-0000-0000-0000-000000000001'), 1::bigint, 'paid entitlement reads modules of course A');
select is((select count(*) from public.lessons where module_id = '20000000-0000-0000-0000-000000000001'), 1::bigint, 'paid entitlement reads lessons of course A');
select is((select count(*) from public.resources where lesson_id = '30000000-0000-0000-0000-000000000001'), 1::bigint, 'paid entitlement reads resources of course A');
select is((select count(*) from public.courses where id = '10000000-0000-0000-0000-000000000002'), 0::bigint, 'entitlement for A does not read private course B');
select is((select count(*) from public.modules where course_id = '10000000-0000-0000-0000-000000000002'), 0::bigint, 'entitlement for A does not read modules of B');
select is((select count(*) from public.lessons where module_id = '20000000-0000-0000-0000-000000000002'), 0::bigint, 'entitlement for A does not read lessons of B');
select is((select count(*) from public.resources where lesson_id = '30000000-0000-0000-0000-000000000002'), 0::bigint, 'entitlement for A does not read resources of B');

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000003', true);
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000003","role":"authenticated"}', true);
select is((select count(*) from public.lessons where id = '30000000-0000-0000-0000-000000000001'), 0::bigint, 'user without entitlement cannot read a paid lesson');
select is((select count(*) from public.resources where id = '35000000-0000-0000-0000-000000000001'), 0::bigint, 'user without entitlement cannot read a paid resource');

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000004', true);
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000004","role":"authenticated"}', true);
select is((select count(*) from public.lessons where id = '30000000-0000-0000-0000-000000000001'), 0::bigint, 'pending entitlement does not grant access');
select is((select count(*) from public.products where id = '40000000-0000-0000-0000-000000000001'), 0::bigint, 'pending entitlement does not reveal an unpublished product');

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
select is((select count(*) from public.resources where lesson_id = '30000000-0000-0000-0000-000000000002'), 1::bigint, 'legacy user_course_access reads resources of B');

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000001","role":"authenticated"}', true);
select is(
  (select count(*) from public.courses where id = '10000000-0000-0000-0000-000000000002')
  + (select count(*) from public.modules where id = '20000000-0000-0000-0000-000000000002')
  + (select count(*) from public.lessons where id = '30000000-0000-0000-0000-000000000002')
  + (select count(*) from public.resources where id = '35000000-0000-0000-0000-000000000002'),
  4::bigint,
  'admin reads private course content'
);
select lives_ok(
  $$update public.lessons set title = 'Admin edit' where id = '30000000-0000-0000-0000-000000000002'$$,
  'admin can edit lesson content'
);
select is((select title from public.lessons where id = '30000000-0000-0000-0000-000000000002'), 'Admin edit', 'admin edit is visible');

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000003', true);
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000003","role":"authenticated"}', true);
select is((select count(*) from public.courses where id = '10000000-0000-0000-0000-000000000003'), 1::bigint, 'public free course remains readable');
select is((select count(*) from public.modules where id = '20000000-0000-0000-0000-000000000003'), 1::bigint, 'public free module remains readable');
select is((select count(*) from public.lessons where id = '30000000-0000-0000-0000-000000000003'), 1::bigint, 'public free lesson remains readable');
select is((select count(*) from public.resources where id = '35000000-0000-0000-0000-000000000003'), 0::bigint, 'public free resource requires exact course access');
select is((select count(*) from public.lessons where id = '30000000-0000-0000-0000-000000000005'), 0::bigint, 'locked paid lesson remains private');
select is((select count(*) from public.resources where id = '35000000-0000-0000-0000-000000000005'), 0::bigint, 'resource attached to a locked paid lesson remains private');

reset role;
select has_table('public', 'entitlements', 'entitlements exists after reconciliation');
select has_column('public', 'products', 'course_id', 'products.course_id exists after reconciliation');
select col_is_fk('public', 'products', 'course_id', 'products.course_id has a foreign key');
select col_is_fk('public', 'entitlements', 'user_id', 'entitlements.user_id has a foreign key');
select col_is_fk('public', 'entitlements', 'product_id', 'entitlements.product_id has a foreign key');
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
