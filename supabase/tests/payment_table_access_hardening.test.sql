begin;

select plan(49);

select is(
  (
    select jsonb_agg(
      jsonb_build_object('grantee', acl.grantee, 'privileges', acl.privileges)
      order by acl.grantee
    )
    from (
      select
        case
          when privileges.grantee = 0 then 'PUBLIC'
          else pg_get_userbyid(privileges.grantee)
        end as grantee,
        jsonb_agg(privileges.privilege_type order by privileges.privilege_type) as privileges
      from pg_class tables
      cross join lateral aclexplode(
        coalesce(tables.relacl, acldefault('r', tables.relowner))
      ) privileges
      where tables.oid = 'public.enrollments'::regclass
        and (
          privileges.grantee = 0
          or pg_get_userbyid(privileges.grantee) in ('anon', 'authenticated', 'service_role')
        )
      group by privileges.grantee
    ) acl
  ),
  '[
    {"grantee":"authenticated","privileges":["INSERT","SELECT"]},
    {"grantee":"service_role","privileges":["DELETE","INSERT","SELECT","UPDATE"]}
  ]'::jsonb,
  'enrollments has exactly the approved direct grants and no PUBLIC or anon grants'
);

select is(
  (
    select jsonb_agg(
      jsonb_build_object('grantee', acl.grantee, 'privileges', acl.privileges)
      order by acl.grantee
    )
    from (
      select
        case
          when privileges.grantee = 0 then 'PUBLIC'
          else pg_get_userbyid(privileges.grantee)
        end as grantee,
        jsonb_agg(privileges.privilege_type order by privileges.privilege_type) as privileges
      from pg_class tables
      cross join lateral aclexplode(
        coalesce(tables.relacl, acldefault('r', tables.relowner))
      ) privileges
      where tables.oid = 'public.icount_webhook_log'::regclass
        and (
          privileges.grantee = 0
          or pg_get_userbyid(privileges.grantee) in ('anon', 'authenticated', 'service_role')
        )
      group by privileges.grantee
    ) acl
  ),
  '[
    {"grantee":"authenticated","privileges":["SELECT"]},
    {"grantee":"service_role","privileges":["INSERT","SELECT"]}
  ]'::jsonb,
  'icount_webhook_log has exactly the approved direct grants and no PUBLIC or anon grants'
);

select is(
  (
    select count(*)
    from (
      values
        ('anon', 'SELECT', false),
        ('anon', 'INSERT', false),
        ('anon', 'UPDATE', false),
        ('anon', 'DELETE', false),
        ('anon', 'TRUNCATE', false),
        ('anon', 'TRIGGER', false),
        ('anon', 'REFERENCES', false),
        ('authenticated', 'SELECT', true),
        ('authenticated', 'INSERT', true),
        ('authenticated', 'UPDATE', false),
        ('authenticated', 'DELETE', false),
        ('authenticated', 'TRUNCATE', false),
        ('authenticated', 'TRIGGER', false),
        ('authenticated', 'REFERENCES', false),
        ('service_role', 'SELECT', true),
        ('service_role', 'INSERT', true),
        ('service_role', 'UPDATE', true),
        ('service_role', 'DELETE', true),
        ('service_role', 'TRUNCATE', false),
        ('service_role', 'TRIGGER', false),
        ('service_role', 'REFERENCES', false)
    ) expected(role_name, privilege_name, allowed)
    where has_table_privilege(
      expected.role_name,
      'public.enrollments',
      expected.privilege_name
    ) is distinct from expected.allowed
  ),
  0::bigint,
  'enrollments effective privilege matrix is exact'
);

select is(
  (
    select count(*)
    from (
      values
        ('anon', 'SELECT', false),
        ('anon', 'INSERT', false),
        ('anon', 'UPDATE', false),
        ('anon', 'DELETE', false),
        ('anon', 'TRUNCATE', false),
        ('anon', 'TRIGGER', false),
        ('anon', 'REFERENCES', false),
        ('authenticated', 'SELECT', true),
        ('authenticated', 'INSERT', false),
        ('authenticated', 'UPDATE', false),
        ('authenticated', 'DELETE', false),
        ('authenticated', 'TRUNCATE', false),
        ('authenticated', 'TRIGGER', false),
        ('authenticated', 'REFERENCES', false),
        ('service_role', 'SELECT', true),
        ('service_role', 'INSERT', true),
        ('service_role', 'UPDATE', false),
        ('service_role', 'DELETE', false),
        ('service_role', 'TRUNCATE', false),
        ('service_role', 'TRIGGER', false),
        ('service_role', 'REFERENCES', false)
    ) expected(role_name, privilege_name, allowed)
    where has_table_privilege(
      expected.role_name,
      'public.icount_webhook_log',
      expected.privilege_name
    ) is distinct from expected.allowed
  ),
  0::bigint,
  'icount_webhook_log effective privilege matrix is exact'
);

select is(
  (
    select jsonb_agg(
      jsonb_build_object(
        'name', policyname,
        'roles', roles,
        'command', cmd
      ) order by policyname
    )
    from pg_policies
    where schemaname = 'public'
      and tablename = 'enrollments'
  ),
  '[
    {"name":"users insert own enrollments","roles":["authenticated"],"command":"INSERT"},
    {"name":"users see own enrollments","roles":["authenticated"],"command":"SELECT"}
  ]'::jsonb,
  'enrollments policy names, commands, and roles are exact'
);

select is(
  (
    select jsonb_agg(
      jsonb_build_object(
        'name', policyname,
        'roles', roles,
        'command', cmd
      ) order by policyname
    )
    from pg_policies
    where schemaname = 'public'
      and tablename = 'icount_webhook_log'
  ),
  '[
    {"name":"admin read webhook log","roles":["authenticated"],"command":"SELECT"}
  ]'::jsonb,
  'icount_webhook_log policy name, command, and role are exact'
);

select is(
  (
    select count(*)
    from pg_policies
    where schemaname = 'public'
      and tablename in ('enrollments', 'icount_webhook_log')
      and roles && array['public', 'anon']::name[]
  ),
  0::bigint,
  'neither table has a policy targeting public or anon'
);

select ok(
  (
    select with_check ~* 'select[[:space:]]+auth[.]uid[(][)]'
      and with_check ~* 'user_id'
    from pg_policies
    where schemaname = 'public'
      and tablename = 'enrollments'
      and policyname = 'users insert own enrollments'
  ),
  'enrollments INSERT policy compares user_id to select auth.uid()'
);

select ok(
  (
    select qual ~* 'select[[:space:]]+auth[.]uid[(][)]'
      and qual ~* 'user_id'
    from pg_policies
    where schemaname = 'public'
      and tablename = 'enrollments'
      and policyname = 'users see own enrollments'
  ),
  'enrollments SELECT policy compares user_id to select auth.uid()'
);

select ok(
  (
    select qual ~* 'has_role'
      and qual ~* 'select[[:space:]]+auth[.]uid[(][)]'
      and qual ~* '''admin''::app_role'
    from pg_policies
    where schemaname = 'public'
      and tablename = 'icount_webhook_log'
      and policyname = 'admin read webhook log'
  ),
  'webhook log policy calls has_role with select auth.uid() and admin'
);

select is(
  (
    select count(*)
    from pg_policies
    where schemaname = 'public'
      and tablename in ('enrollments', 'icount_webhook_log')
      and concat_ws(' ', qual, with_check) ~* 'auth[.]uid[(][)]'
      and concat_ws(' ', qual, with_check) !~* 'select[[:space:]]+auth[.]uid[(][)]'
  ),
  0::bigint,
  'new policies contain no direct auth.uid() call without select'
);

select has_index(
  'public',
  'enrollments',
  'enrollments_course_id_idx',
  'enrollments_course_id_idx exists'
);

select is(
  (
    select array_agg(attributes.attname order by keys.ordinality)
    from pg_index indexes
    cross join lateral unnest(indexes.indkey) with ordinality keys(attnum, ordinality)
    join pg_attribute attributes
      on attributes.attrelid = indexes.indrelid
     and attributes.attnum = keys.attnum
    where indexes.indexrelid = to_regclass('public.enrollments_course_id_idx')
  ),
  array['course_id']::name[],
  'enrollments_course_id_idx covers exactly enrollments.course_id'
);

insert into auth.users (id) values
  ('00000000-0000-0000-0000-000000000901'),
  ('00000000-0000-0000-0000-000000000902'),
  ('00000000-0000-0000-0000-000000000903');

insert into public.user_roles (user_id, role) values
  ('00000000-0000-0000-0000-000000000903', 'admin');

insert into public.courses (id, user_id, title, category, level, published, is_free) values
  ('10000000-0000-0000-0000-000000000901', '00000000-0000-0000-0000-000000000903', 'Payment access course 1', 'strategy', 'beginner', false, false),
  ('10000000-0000-0000-0000-000000000902', '00000000-0000-0000-0000-000000000903', 'Payment access course 2', 'strategy', 'beginner', false, false),
  ('10000000-0000-0000-0000-000000000903', '00000000-0000-0000-0000-000000000903', 'Payment access course 3', 'strategy', 'beginner', false, false),
  ('10000000-0000-0000-0000-000000000904', '00000000-0000-0000-0000-000000000903', 'Payment access course 4', 'strategy', 'beginner', false, false),
  ('10000000-0000-0000-0000-000000000905', '00000000-0000-0000-0000-000000000903', 'Payment access course 5', 'strategy', 'beginner', false, false);

insert into public.enrollments (id, user_id, course_id) values
  ('e0000000-0000-0000-0000-000000000901', '00000000-0000-0000-0000-000000000901', '10000000-0000-0000-0000-000000000901'),
  ('e0000000-0000-0000-0000-000000000902', '00000000-0000-0000-0000-000000000902', '10000000-0000-0000-0000-000000000902'),
  ('e0000000-0000-0000-0000-000000000903', '00000000-0000-0000-0000-000000000903', '10000000-0000-0000-0000-000000000903');

insert into public.icount_webhook_log (id, raw, result) values
  ('f0000000-0000-0000-0000-000000000901', '{"probe":1}', 'test_one'),
  ('f0000000-0000-0000-0000-000000000902', '{"probe":2}', 'test_two');

set local role anon;
select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claims', '{"role":"anon"}', true);

select throws_ok(
  $$select count(*) from public.enrollments$$::text,
  '42501'::char(5),
  null::text,
  'anon cannot select enrollments'
);
select throws_ok(
  $$insert into public.enrollments (user_id, course_id) values ('00000000-0000-0000-0000-000000000901', '10000000-0000-0000-0000-000000000904')$$::text,
  '42501'::char(5),
  null::text,
  'anon cannot insert enrollments'
);
select throws_ok(
  $test$do $$ begin execute 'truncate table public.enrollments'; raise exception 'truncate unexpectedly succeeded' using errcode = 'P0001'; end $$;$test$::text,
  '42501'::char(5),
  null::text,
  'anon cannot truncate enrollments'
);
select throws_ok(
  $$select count(*) from public.icount_webhook_log$$::text,
  '42501'::char(5),
  null::text,
  'anon cannot select webhook logs'
);
select throws_ok(
  $$insert into public.icount_webhook_log (raw, result) values ('{}', 'anon')$$::text,
  '42501'::char(5),
  null::text,
  'anon cannot insert webhook logs'
);
select throws_ok(
  $test$do $$ begin execute 'truncate table public.icount_webhook_log'; raise exception 'truncate unexpectedly succeeded' using errcode = 'P0001'; end $$;$test$::text,
  '42501'::char(5),
  null::text,
  'anon cannot truncate webhook logs'
);

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000901', true);
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000901","role":"authenticated"}', true);

select is(
  (select count(*) from public.enrollments where user_id = '00000000-0000-0000-0000-000000000901'),
  1::bigint,
  'authenticated owner reads own enrollment'
);
select is(
  (select count(*) from public.enrollments where user_id = '00000000-0000-0000-0000-000000000902'),
  0::bigint,
  'authenticated owner cannot read another user enrollment'
);
select lives_ok(
  $$insert into public.enrollments (id, user_id, course_id) values ('e0000000-0000-0000-0000-000000000904', '00000000-0000-0000-0000-000000000901', '10000000-0000-0000-0000-000000000904')$$,
  'authenticated owner can insert own enrollment'
);
select throws_ok(
  $$insert into public.enrollments (user_id, course_id) values ('00000000-0000-0000-0000-000000000902', '10000000-0000-0000-0000-000000000905')$$::text,
  '42501'::char(5),
  null::text,
  'authenticated owner cannot insert another user enrollment'
);
select throws_ok(
  $$update public.enrollments set status = 'paid' where id = 'e0000000-0000-0000-0000-000000000901'$$::text,
  '42501'::char(5),
  null::text,
  'authenticated owner cannot update enrollment'
);
select throws_ok(
  $$delete from public.enrollments where id = 'e0000000-0000-0000-0000-000000000901'$$::text,
  '42501'::char(5),
  null::text,
  'authenticated owner cannot delete enrollment'
);
select throws_ok(
  $test$do $$ begin execute 'truncate table public.enrollments'; raise exception 'truncate unexpectedly succeeded' using errcode = 'P0001'; end $$;$test$::text,
  '42501'::char(5),
  null::text,
  'authenticated cannot truncate enrollments'
);
select is(
  (select count(*) from public.icount_webhook_log),
  0::bigint,
  'regular authenticated user cannot read webhook logs'
);
select throws_ok(
  $$insert into public.icount_webhook_log (raw, result) values ('{}', 'authenticated')$$::text,
  '42501'::char(5),
  null::text,
  'authenticated user cannot insert webhook logs'
);
select throws_ok(
  $$update public.icount_webhook_log set result = 'authenticated'$$::text,
  '42501'::char(5),
  null::text,
  'authenticated user cannot update webhook logs'
);
select throws_ok(
  $$delete from public.icount_webhook_log$$::text,
  '42501'::char(5),
  null::text,
  'authenticated user cannot delete webhook logs'
);

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000902', true);
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000902","role":"authenticated"}', true);
select is(
  (select count(*) from public.enrollments where user_id = '00000000-0000-0000-0000-000000000901'),
  0::bigint,
  'authenticated non-owner cannot read owner enrollment'
);
select is(
  (select count(*) from public.enrollments where user_id = '00000000-0000-0000-0000-000000000902'),
  1::bigint,
  'authenticated non-owner reads own enrollment'
);
select throws_ok(
  $$insert into public.enrollments (user_id, course_id) values ('00000000-0000-0000-0000-000000000901', '10000000-0000-0000-0000-000000000905')$$::text,
  '42501'::char(5),
  null::text,
  'authenticated non-owner cannot insert for owner'
);

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000903', true);
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000903","role":"authenticated"}', true);
select is(
  (select count(*) from public.enrollments),
  1::bigint,
  'authenticated admin still reads only own enrollment'
);
select is(
  (select count(*) from public.icount_webhook_log),
  2::bigint,
  'authenticated admin can read webhook logs'
);
select throws_ok(
  $$insert into public.icount_webhook_log (raw, result) values ('{}', 'admin')$$::text,
  '42501'::char(5),
  null::text,
  'authenticated admin cannot insert webhook logs'
);
select throws_ok(
  $$update public.icount_webhook_log set result = 'admin'$$::text,
  '42501'::char(5),
  null::text,
  'authenticated admin cannot update webhook logs'
);
select throws_ok(
  $$delete from public.icount_webhook_log$$::text,
  '42501'::char(5),
  null::text,
  'authenticated admin cannot delete webhook logs'
);

set local role service_role;
select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claims', '{"role":"service_role"}', true);

select is(
  (select count(*) from public.enrollments),
  4::bigint,
  'service_role can select all enrollments'
);
select lives_ok(
  $$insert into public.enrollments (id, user_id, course_id) values ('e0000000-0000-0000-0000-000000000905', '00000000-0000-0000-0000-000000000901', '10000000-0000-0000-0000-000000000905')$$,
  'service_role can insert enrollments'
);
select lives_ok(
  $$update public.enrollments set status = 'paid' where id = 'e0000000-0000-0000-0000-000000000905'$$,
  'service_role can update enrollments'
);
select lives_ok(
  $$delete from public.enrollments where id = 'e0000000-0000-0000-0000-000000000905'$$,
  'service_role can delete enrollments'
);
select throws_ok(
  $test$do $$ begin execute 'truncate table public.enrollments'; raise exception 'truncate unexpectedly succeeded' using errcode = 'P0001'; end $$;$test$::text,
  '42501'::char(5),
  null::text,
  'service_role cannot truncate enrollments'
);
select is(
  (select count(*) from public.icount_webhook_log),
  2::bigint,
  'service_role can select webhook logs'
);
select lives_ok(
  $$insert into public.icount_webhook_log (id, raw, result) values ('f0000000-0000-0000-0000-000000000903', '{"probe":3}', 'service_role')$$,
  'icount-webhook can still insert a log with service_role'
);
select is(
  (select count(*) from public.icount_webhook_log),
  3::bigint,
  'service_role insert persists inside the test transaction'
);
select throws_ok(
  $$update public.icount_webhook_log set result = 'service_role'$$::text,
  '42501'::char(5),
  null::text,
  'service_role cannot update webhook logs'
);
select throws_ok(
  $$delete from public.icount_webhook_log$$::text,
  '42501'::char(5),
  null::text,
  'service_role cannot delete webhook logs'
);
select throws_ok(
  $test$do $$ begin execute 'truncate table public.icount_webhook_log'; raise exception 'truncate unexpectedly succeeded' using errcode = 'P0001'; end $$;$test$::text,
  '42501'::char(5),
  null::text,
  'service_role cannot truncate webhook logs'
);

reset role;

select * from finish();

rollback;
