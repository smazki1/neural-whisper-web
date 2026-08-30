begin;

select plan(5);

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
