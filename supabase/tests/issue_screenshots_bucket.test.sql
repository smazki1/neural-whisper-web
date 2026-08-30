begin;

select plan(9);

insert into storage.objects (
  id,
  bucket_id,
  name,
  metadata
)
values (
  '00000000-0000-0000-0000-000000000100',
  'issue-screenshots',
  'rls-probe/existing.png',
  '{"mimetype":"image/png","size":1}'::jsonb
);

select is(
  (
    select count(*)
    from storage.buckets
    where id = 'issue-screenshots'
      and name = 'issue-screenshots'
  ),
  1::bigint,
  'issue-screenshots bucket exists'
);

select is(
  (select public from storage.buckets where id = 'issue-screenshots'),
  false,
  'issue-screenshots bucket is private'
);

select is(
  (select file_size_limit from storage.buckets where id = 'issue-screenshots'),
  10485760::bigint,
  'issue-screenshots bucket has a 10 MiB file-size limit'
);

select is(
  (select allowed_mime_types from storage.buckets where id = 'issue-screenshots'),
  array['image/png', 'image/jpeg', 'image/webp']::text[],
  'issue-screenshots bucket allows only the approved image MIME types'
);

set local role anon;
select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claims', '{"role":"anon"}', true);

select is(
  (
    select count(*)
    from storage.objects
    where id = '00000000-0000-0000-0000-000000000100'
  ),
  0::bigint,
  'anon cannot read issue-screenshots objects'
);

select throws_ok(
  $$insert into storage.objects (bucket_id, name, metadata) values ('issue-screenshots', 'rls-probe/anon.png', '{"mimetype":"image/png","size":1}'::jsonb)$$::text,
  '42501'::char(5),
  null::text,
  'anon cannot insert issue-screenshots objects'
);

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000101', true);
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000101","role":"authenticated"}', true);

select is(
  (
    select count(*)
    from storage.objects
    where id = '00000000-0000-0000-0000-000000000100'
  ),
  0::bigint,
  'unauthorized authenticated user cannot read issue-screenshots objects'
);

select throws_ok(
  $$insert into storage.objects (bucket_id, name, metadata) values ('issue-screenshots', 'rls-probe/authenticated.png', '{"mimetype":"image/png","size":1}'::jsonb)$$::text,
  '42501'::char(5),
  null::text,
  'unauthorized authenticated user cannot insert issue-screenshots objects'
);

reset role;

select is(
  (
    select count(*)
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and roles && array['anon', 'public']::name[]
      and (
        concat_ws(' ', qual, with_check) ilike '%issue-screenshots%'
        or concat_ws(' ', qual, with_check) not ilike '%bucket_id%'
      )
  ),
  0::bigint,
  'issue-screenshots has no anon or public storage policy'
);

select * from finish();

rollback;
