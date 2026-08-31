begin;

select plan(21);

select has_table(
  'public',
  'icount_webhook_log',
  'public.icount_webhook_log exists'
);

select is(
  (
    select jsonb_agg(
      jsonb_build_object(
        'position', ordinal_position,
        'name', column_name,
        'type', data_type,
        'udt', udt_name,
        'nullable', is_nullable,
        'default', column_default
      ) order by ordinal_position
    )
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'icount_webhook_log'
  ),
  '[
    {"position":1,"name":"id","type":"uuid","udt":"uuid","nullable":"NO","default":"gen_random_uuid()"},
    {"position":2,"name":"created_at","type":"timestamp with time zone","udt":"timestamptz","nullable":"YES","default":"now()"},
    {"position":3,"name":"raw","type":"jsonb","udt":"jsonb","nullable":"YES","default":null},
    {"position":4,"name":"result","type":"text","udt":"text","nullable":"YES","default":null}
  ]'::jsonb,
  'icount_webhook_log columns match Production exactly'
);

select is(
  (
    select jsonb_agg(
      jsonb_build_object(
        'name', con.conname,
        'type', con.contype,
        'deferrable', con.condeferrable,
        'deferred', con.condeferred,
        'validated', con.convalidated,
        'definition', pg_get_constraintdef(con.oid, true)
      ) order by con.conname
    )
    from pg_constraint con
    where con.conrelid = to_regclass('public.icount_webhook_log')
  ),
  '[
    {"name":"icount_webhook_log_pkey","type":"p","deferrable":false,"deferred":false,"validated":true,"definition":"PRIMARY KEY (id)"}
  ]'::jsonb,
  'icount_webhook_log constraints match Production exactly'
);

select is(
  (
    select jsonb_agg(
      jsonb_build_object('name', indexname, 'definition', indexdef)
      order by indexname
    )
    from pg_indexes
    where schemaname = 'public'
      and tablename = 'icount_webhook_log'
  ),
  '[
    {"name":"icount_webhook_log_pkey","definition":"CREATE UNIQUE INDEX icount_webhook_log_pkey ON public.icount_webhook_log USING btree (id)"}
  ]'::jsonb,
  'icount_webhook_log indexes match Production exactly'
);

select is(
  (
    select jsonb_build_object(
      'enabled', c.relrowsecurity,
      'forced', c.relforcerowsecurity,
      'owner', pg_get_userbyid(c.relowner)
    )
    from pg_class c
    where c.oid = to_regclass('public.icount_webhook_log')
  ),
  '{"enabled":true,"forced":false,"owner":"postgres"}'::jsonb,
  'icount_webhook_log RLS mode and owner match Production'
);

select is(
  (
    select jsonb_agg(
      jsonb_build_object(
        'name', policyname,
        'permissive', permissive,
        'roles', roles,
        'command', cmd,
        'using', qual,
        'check', with_check
      ) order by policyname
    )
    from pg_policies
    where schemaname = 'public'
      and tablename = 'icount_webhook_log'
  ),
  '[
    {"name":"admin read webhook log","permissive":"PERMISSIVE","roles":["public"],"command":"SELECT","using":"has_role(auth.uid(), ''admin''::app_role)","check":null}
  ]'::jsonb,
  'icount_webhook_log policy matches Production exactly'
);

select is(
  (
    select jsonb_agg(
      jsonb_build_object(
        'grantee', grants.grantee,
        'grantable', grants.is_grantable,
        'privileges', grants.privileges
      ) order by grants.grantee
    )
    from (
      select
        grantee,
        min(is_grantable) as is_grantable,
        jsonb_agg(privilege_type order by privilege_type) as privileges
      from information_schema.role_table_grants
      where table_schema = 'public'
        and table_name = 'icount_webhook_log'
      group by grantee
    ) grants
  ),
  '[
    {"grantee":"anon","grantable":"NO","privileges":["DELETE","INSERT","REFERENCES","SELECT","TRIGGER","TRUNCATE","UPDATE"]},
    {"grantee":"authenticated","grantable":"NO","privileges":["DELETE","INSERT","REFERENCES","SELECT","TRIGGER","TRUNCATE","UPDATE"]},
    {"grantee":"postgres","grantable":"YES","privileges":["DELETE","INSERT","REFERENCES","SELECT","TRIGGER","TRUNCATE","UPDATE"]},
    {"grantee":"service_role","grantable":"NO","privileges":["DELETE","INSERT","REFERENCES","SELECT","TRIGGER","TRUNCATE","UPDATE"]}
  ]'::jsonb,
  'icount_webhook_log grants match Production exactly'
);

select has_table(
  'public',
  'enrollments',
  'public.enrollments exists'
);

select is(
  (
    select jsonb_agg(
      jsonb_build_object(
        'position', ordinal_position,
        'name', column_name,
        'type', data_type,
        'udt', udt_name,
        'nullable', is_nullable,
        'default', column_default
      ) order by ordinal_position
    )
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'enrollments'
  ),
  '[
    {"position":1,"name":"id","type":"uuid","udt":"uuid","nullable":"NO","default":"gen_random_uuid()"},
    {"position":2,"name":"user_id","type":"uuid","udt":"uuid","nullable":"NO","default":null},
    {"position":3,"name":"course_id","type":"uuid","udt":"uuid","nullable":"NO","default":null},
    {"position":4,"name":"status","type":"text","udt":"text","nullable":"YES","default":"''pending''::text"},
    {"position":5,"name":"icount_doc_number","type":"text","udt":"text","nullable":"YES","default":null},
    {"position":6,"name":"amount_paid","type":"numeric","udt":"numeric","nullable":"YES","default":null},
    {"position":7,"name":"enrolled_at","type":"timestamp with time zone","udt":"timestamptz","nullable":"YES","default":null},
    {"position":8,"name":"created_at","type":"timestamp with time zone","udt":"timestamptz","nullable":"YES","default":"now()"},
    {"position":9,"name":"icount_confirmation_code","type":"text","udt":"text","nullable":"YES","default":null},
    {"position":10,"name":"icount_doc_url","type":"text","udt":"text","nullable":"YES","default":null}
  ]'::jsonb,
  'enrollments columns match Production exactly'
);

select is(
  (
    select count(*)
    from pg_constraint
    where conrelid = to_regclass('public.enrollments')
  ),
  5::bigint,
  'enrollments has exactly five constraints'
);

select is(
  (
    select pg_get_constraintdef(oid, true)
    from pg_constraint
    where conrelid = to_regclass('public.enrollments')
      and conname = 'enrollments_pkey'
  ),
  'PRIMARY KEY (id)',
  'enrollments primary key matches Production'
);

select is(
  (
    select pg_get_constraintdef(oid, true)
    from pg_constraint
    where conrelid = to_regclass('public.enrollments')
      and conname = 'enrollments_user_id_course_id_key'
  ),
  'UNIQUE (user_id, course_id)',
  'enrollments unique constraint matches Production'
);

select is(
  (
    select pg_get_constraintdef(oid, true)
    from pg_constraint
    where conrelid = to_regclass('public.enrollments')
      and conname = 'enrollments_user_id_fkey'
  ),
  'FOREIGN KEY (user_id) REFERENCES auth.users(id)',
  'enrollments user foreign key matches Production'
);

select is(
  (
    select pg_get_constraintdef(oid, true)
    from pg_constraint
    where conrelid = to_regclass('public.enrollments')
      and conname = 'enrollments_course_id_fkey'
  ),
  'FOREIGN KEY (course_id) REFERENCES courses(id)',
  'enrollments course foreign key matches Production'
);

select is(
  (
    select pg_get_constraintdef(oid, true)
    from pg_constraint
    where conrelid = to_regclass('public.enrollments')
      and conname = 'enrollments_status_check'
  ),
  'CHECK (status = ANY (ARRAY[''pending''::text, ''paid''::text, ''refunded''::text, ''failed''::text]))',
  'enrollments status constraint matches Production'
);

select is(
  (
    select jsonb_agg(
      jsonb_build_object('name', indexname, 'definition', indexdef)
      order by indexname
    )
    from pg_indexes
    where schemaname = 'public'
      and tablename = 'enrollments'
  ),
  '[
    {"name":"enrollments_pkey","definition":"CREATE UNIQUE INDEX enrollments_pkey ON public.enrollments USING btree (id)"},
    {"name":"enrollments_user_id_course_id_key","definition":"CREATE UNIQUE INDEX enrollments_user_id_course_id_key ON public.enrollments USING btree (user_id, course_id)"}
  ]'::jsonb,
  'enrollments indexes match Production exactly'
);

select is(
  (
    select jsonb_build_object(
      'enabled', c.relrowsecurity,
      'forced', c.relforcerowsecurity,
      'owner', pg_get_userbyid(c.relowner)
    )
    from pg_class c
    where c.oid = to_regclass('public.enrollments')
  ),
  '{"enabled":true,"forced":false,"owner":"postgres"}'::jsonb,
  'enrollments RLS mode and owner match Production'
);

select is(
  (
    select jsonb_agg(
      jsonb_build_object(
        'name', policyname,
        'permissive', permissive,
        'roles', roles,
        'command', cmd,
        'using', qual,
        'check', with_check
      ) order by policyname
    )
    from pg_policies
    where schemaname = 'public'
      and tablename = 'enrollments'
  ),
  '[
    {"name":"users insert own enrollments","permissive":"PERMISSIVE","roles":["public"],"command":"INSERT","using":null,"check":"(auth.uid() = user_id)"},
    {"name":"users see own enrollments","permissive":"PERMISSIVE","roles":["public"],"command":"SELECT","using":"(auth.uid() = user_id)","check":null}
  ]'::jsonb,
  'enrollments policies and roles match Production exactly'
);

select is(
  (
    select jsonb_agg(
      jsonb_build_object(
        'grantee', grants.grantee,
        'grantable', grants.is_grantable,
        'privileges', grants.privileges
      ) order by grants.grantee
    )
    from (
      select
        grantee,
        min(is_grantable) as is_grantable,
        jsonb_agg(privilege_type order by privilege_type) as privileges
      from information_schema.role_table_grants
      where table_schema = 'public'
        and table_name = 'enrollments'
      group by grantee
    ) grants
  ),
  '[
    {"grantee":"anon","grantable":"NO","privileges":["DELETE","INSERT","REFERENCES","SELECT","TRIGGER","TRUNCATE","UPDATE"]},
    {"grantee":"authenticated","grantable":"NO","privileges":["DELETE","INSERT","REFERENCES","SELECT","TRIGGER","TRUNCATE","UPDATE"]},
    {"grantee":"postgres","grantable":"YES","privileges":["DELETE","INSERT","REFERENCES","SELECT","TRIGGER","TRUNCATE","UPDATE"]},
    {"grantee":"service_role","grantable":"NO","privileges":["DELETE","INSERT","REFERENCES","SELECT","TRIGGER","TRUNCATE","UPDATE"]}
  ]'::jsonb,
  'enrollments grants match Production exactly'
);

select has_column(
  'public',
  'courses',
  'icount_page_url',
  'public.courses.icount_page_url exists'
);

select is(
  (
    select jsonb_build_object(
      'position', ordinal_position,
      'type', data_type,
      'udt', udt_name,
      'nullable', is_nullable,
      'default', column_default
    )
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'courses'
      and column_name = 'icount_page_url'
  ),
  '{"position":30,"type":"text","udt":"text","nullable":"YES","default":null}'::jsonb,
  'courses.icount_page_url matches Production type, nullability, position, and default'
);

select * from finish();

rollback;
