begin;

select plan(20);

insert into auth.users (id) values
  ('00000000-0000-0000-0000-000000000101'),
  ('00000000-0000-0000-0000-000000000102'),
  ('00000000-0000-0000-0000-000000000103'),
  ('00000000-0000-0000-0000-000000000104');

insert into public.user_roles (user_id, role) values
  ('00000000-0000-0000-0000-000000000101', 'admin');

insert into public.courses (
  id, user_id, title, category, level, published, is_free
) values
  (
    '10000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000101',
    'Course A', 'strategy', 'beginner', true, false
  ),
  (
    '10000000-0000-0000-0000-000000000102',
    '00000000-0000-0000-0000-000000000101',
    'Course B', 'strategy', 'beginner', true, false
  );

insert into public.modules (id, course_id, title, position) values
  (
    '20000000-0000-0000-0000-000000000101',
    '10000000-0000-0000-0000-000000000101',
    'Module A', 0
  ),
  (
    '20000000-0000-0000-0000-000000000102',
    '10000000-0000-0000-0000-000000000102',
    'Module B', 0
  );

insert into public.lessons (
  id, module_id, title, position, is_upcoming
) values
  (
    '30000000-0000-0000-0000-000000000101',
    '20000000-0000-0000-0000-000000000101',
    'Lesson A', 0, false
  ),
  (
    '30000000-0000-0000-0000-000000000102',
    '20000000-0000-0000-0000-000000000102',
    'Lesson B', 0, true
  );

insert into public.products (
  id, title, slug, category, is_published, course_id
) values
  (
    '40000000-0000-0000-0000-000000000101',
    'Product A', 'product-a-resources', 'basic', true,
    '10000000-0000-0000-0000-000000000101'
  ),
  (
    '40000000-0000-0000-0000-000000000102',
    'Product B', 'product-b-resources', 'basic', true,
    '10000000-0000-0000-0000-000000000102'
  );

insert into public.entitlements (user_id, product_id, status) values
  (
    '00000000-0000-0000-0000-000000000102',
    '40000000-0000-0000-0000-000000000101',
    'paid'
  );

insert into public.orders (
  id, user_id, product_id, total_amount, status
) values (
  '50000000-0000-0000-0000-000000000103',
  '00000000-0000-0000-0000-000000000103',
  '40000000-0000-0000-0000-000000000102',
  100,
  'completed'
);

insert into public.user_course_access (
  user_id, course_id, product_id, order_id
) values
  (
    '00000000-0000-0000-0000-000000000103',
    '10000000-0000-0000-0000-000000000102',
    '40000000-0000-0000-0000-000000000102',
    '50000000-0000-0000-0000-000000000103'
  );

insert into public.resources (
  id, lesson_id, type, label, url, storage_path, position, file_name, mime_type, size_bytes
) values
  (
    '35000000-0000-0000-0000-000000000101',
    '30000000-0000-0000-0000-000000000101',
    'file', 'Course A workbook', null,
    '10000000-0000-0000-0000-000000000101/30000000-0000-0000-0000-000000000101/workbook-a.pdf',
    0, 'workbook-a.pdf', 'application/pdf', 1024
  ),
  (
    '35000000-0000-0000-0000-000000000102',
    '30000000-0000-0000-0000-000000000101',
    'link', 'Course A worksheet', 'https://example.test/worksheet-a', null,
    1, null, null, null
  ),
  (
    '35000000-0000-0000-0000-000000000103',
    '30000000-0000-0000-0000-000000000102',
    'file', 'Course B workbook', null,
    '10000000-0000-0000-0000-000000000102/30000000-0000-0000-0000-000000000102/workbook-b.pdf',
    0, 'workbook-b.pdf', 'application/pdf', 2048
  );

insert into storage.objects (id, bucket_id, name) values
  (
    '60000000-0000-0000-0000-000000000101',
    'course-resources',
    '10000000-0000-0000-0000-000000000101/30000000-0000-0000-0000-000000000101/workbook-a.pdf'
  ),
  (
    '60000000-0000-0000-0000-000000000102',
    'course-resources',
    '10000000-0000-0000-0000-000000000102/30000000-0000-0000-0000-000000000102/workbook-b.pdf'
  );

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000102', true);
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000102","role":"authenticated"}', true);

select is(
  (select count(*) from public.resources where lesson_id = '30000000-0000-0000-0000-000000000101'),
  2::bigint,
  'paid entitlement reads every resource in course A'
);
select is(
  (select count(*) from public.resources where lesson_id = '30000000-0000-0000-0000-000000000102'),
  0::bigint,
  'paid entitlement for A does not read course B resources'
);
select is(
  (select count(*) from storage.objects),
  1::bigint,
  'paid entitlement for A reads only the mapped course A object'
);

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000103', true);
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000103","role":"authenticated"}', true);

select is(
  (select count(*) from public.resources where lesson_id = '30000000-0000-0000-0000-000000000102'),
  1::bigint,
  'legacy course access reads course B resources'
);
select is(
  (select count(*) from public.resources where lesson_id = '30000000-0000-0000-0000-000000000101'),
  0::bigint,
  'legacy course B access does not read course A resources'
);
select is(
  (select count(*) from storage.objects),
  1::bigint,
  'legacy course B access reads only the mapped course B object'
);

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000104', true);
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000104","role":"authenticated"}', true);

select is((select count(*) from public.resources), 0::bigint, 'user without access reads no resource metadata');
select is((select count(*) from storage.objects), 0::bigint, 'user without access reads no resource objects');
select throws_ok(
  $$select public.reorder_lesson_resources('30000000-0000-0000-0000-000000000101', array['35000000-0000-0000-0000-000000000101'::uuid, '35000000-0000-0000-0000-000000000102'::uuid])$$,
  '42501'::char(5),
  'administrator access required'::text,
  'non-admin cannot reorder resources'
);

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000101', true);
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000101","role":"authenticated"}', true);

select is((select count(*) from public.resources), 3::bigint, 'admin reads all resource metadata');
select is((select count(*) from storage.objects), 2::bigint, 'admin reads all course resource objects');
select lives_ok(
  $$select public.reorder_lesson_resources('30000000-0000-0000-0000-000000000101', array['35000000-0000-0000-0000-000000000102'::uuid, '35000000-0000-0000-0000-000000000101'::uuid])$$,
  'admin can reorder a complete resource list'
);
select is(
  (
    select string_agg(id::text || ':' || position::text, ',' order by position)
    from public.resources
    where lesson_id = '30000000-0000-0000-0000-000000000101'
  ),
  '35000000-0000-0000-0000-000000000102:0,35000000-0000-0000-0000-000000000101:1',
  'reorder persists the requested positions'
);
select throws_ok(
  $$select public.reorder_lesson_resources('30000000-0000-0000-0000-000000000101', array['35000000-0000-0000-0000-000000000101'::uuid])$$,
  '22023'::char(5),
  'resource order must contain every lesson resource exactly once'::text,
  'incomplete resource order is rejected atomically'
);

reset role;

set local role anon;
select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claims', '{"role":"anon"}', true);
select is((select count(*) from public.resources), 0::bigint, 'anonymous users read no resource metadata');

reset role;

select is(
  (select public from storage.buckets where id = 'course-resources'),
  false,
  'course-resources bucket is private'
);
select is(
  (select file_size_limit from storage.buckets where id = 'course-resources'),
  26214400::bigint,
  'course-resources bucket enforces the 25MB limit'
);
select ok(
  (
    select allowed_mime_types @> array['application/pdf']::text[]
      and not allowed_mime_types && array['video/mp4', 'application/x-msdownload']::text[]
    from storage.buckets
    where id = 'course-resources'
  ),
  'bucket permits documents but excludes video and executables'
);
select is(
  (
    select count(*)
    from pg_policies
    where schemaname = 'public'
      and tablename = 'resources'
      and policyname in (
        'Public can view resources of published courses',
        'Public can view resources of free or preview lessons',
        'Owners can modify resources'
      )
  ),
  0::bigint,
  'legacy public and owner resource policies are removed'
);
select is(
  (
    select is_upcoming
    from public.course_curriculum('10000000-0000-0000-0000-000000000102')
    where lesson_id = '30000000-0000-0000-0000-000000000102'
  ),
  true,
  'curriculum exposes the explicit upcoming lesson state'
);

select * from finish();
rollback;
