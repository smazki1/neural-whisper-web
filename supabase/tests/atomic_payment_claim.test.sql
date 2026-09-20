begin;

select plan(39);

select ok(
  to_regprocedure('public.claim_payment_transaction(uuid,uuid,text)') is not null,
  'atomic payment claim function exists'
);

select ok(
  not coalesce((
    select prosecdef
    from pg_proc
    where oid = to_regprocedure('public.claim_payment_transaction(uuid,uuid,text)')
  ), true),
  'atomic payment claim runs as security invoker'
);

select is(
  (
    select proconfig
    from pg_proc
    where oid = to_regprocedure('public.claim_payment_transaction(uuid,uuid,text)')
  ),
  array['search_path=""']::text[],
  'atomic payment claim has an empty search_path'
);

select ok(
  not exists (
    select 1
    from pg_proc functions
    cross join lateral aclexplode(
      coalesce(functions.proacl, acldefault('f', functions.proowner))
    ) privileges
    where functions.oid = to_regprocedure('public.claim_payment_transaction(uuid,uuid,text)')
      and privileges.grantee = 0
      and privileges.privilege_type = 'EXECUTE'
  ),
  'PUBLIC cannot execute atomic payment claims'
);

select ok(
  not has_function_privilege(
    'anon',
    'public.claim_payment_transaction(uuid,uuid,text)',
    'EXECUTE'
  ),
  'anon cannot execute atomic payment claims'
);

select ok(
  not has_function_privilege(
    'authenticated',
    'public.claim_payment_transaction(uuid,uuid,text)',
    'EXECUTE'
  ),
  'authenticated cannot execute atomic payment claims directly'
);

select ok(
  has_function_privilege(
    'service_role',
    'public.claim_payment_transaction(uuid,uuid,text)',
    'EXECUTE'
  ),
  'service_role can execute atomic payment claims'
);

select ok(
  (
    select pg_get_constraintdef(oid, true) ilike '%refunded%'
    from pg_constraint
    where conrelid = 'public.payment_intents'::regclass
      and conname = 'payment_intents_status_check'
  ),
  'payment intents can represent the refunded terminal state'
);

insert into auth.users (id, email) values
  ('10000000-0000-0000-0000-000000000101', 'owner@example.test'),
  ('10000000-0000-0000-0000-000000000102', 'other@example.test'),
  ('10000000-0000-0000-0000-000000000103', 'states@example.test'),
  ('10000000-0000-0000-0000-000000000104', 'entitlement-failure@example.test'),
  ('10000000-0000-0000-0000-000000000105', 'intent-failure@example.test');

insert into public.products (id, title, slug, price, product_type, is_published) values
  ('20000000-0000-0000-0000-000000000101', 'Atomic claim product', 'atomic-claim-product', 100, 'course', true),
  ('20000000-0000-0000-0000-000000000102', 'Entitlement failure product', 'entitlement-failure-product', 100, 'course', true),
  ('20000000-0000-0000-0000-000000000103', 'Intent failure product', 'intent-failure-product', 100, 'course', true);

insert into public.payment_intents (
  id,
  product_id,
  status,
  expected_amount,
  amount_paid,
  buyer_email,
  icount_doc_url
) values
  ('30000000-0000-0000-0000-000000000101', '20000000-0000-0000-0000-000000000101', 'paid', 100, 100, U&'\00A0Owner@Example.Test\2007', 'https://example.test/document'),
  ('30000000-0000-0000-0000-000000000102', '20000000-0000-0000-0000-000000000101', 'paid', 100, 100, 'owner@example.test', 'https://example.test/private-document'),
  ('30000000-0000-0000-0000-000000000103', '20000000-0000-0000-0000-000000000101', 'paid', 100, 100, 'different@example.test', 'https://example.test/mismatch-document'),
  ('30000000-0000-0000-0000-000000000104', '20000000-0000-0000-0000-000000000101', 'pending', 100, null, null, null),
  ('30000000-0000-0000-0000-000000000105', '20000000-0000-0000-0000-000000000101', 'failed', 100, null, null, null),
  ('30000000-0000-0000-0000-000000000106', '20000000-0000-0000-0000-000000000101', 'refunded', 100, 100, 'states@example.test', null),
  ('30000000-0000-0000-0000-000000000107', '20000000-0000-0000-0000-000000000102', 'paid', 100, 100, 'entitlement-failure@example.test', null),
  ('30000000-0000-0000-0000-000000000108', '20000000-0000-0000-0000-000000000103', 'paid', 100, 100, 'intent-failure@example.test', null);

create temporary table claim_results (
  label text primary key,
  result jsonb not null
) on commit drop;
grant select, insert on table claim_results to service_role;

set local role service_role;

insert into claim_results (label, result)
select 'first_claim', public.claim_payment_transaction(
  '30000000-0000-0000-0000-000000000101',
  '10000000-0000-0000-0000-000000000101',
  E'\towner@example.test\n'
);

reset role;

select is((select result ->> 'status' from claim_results where label = 'first_claim'), 'claimed', 'a paid intent is claimed once');
select is((select result ->> 'productSlug' from claim_results where label = 'first_claim'), 'atomic-claim-product', 'a successful claim preserves productSlug');
select is((select result ->> 'docUrl' from claim_results where label = 'first_claim'), 'https://example.test/document', 'a verified owner receives docUrl');
select is((select count(*) from public.entitlements where user_id = '10000000-0000-0000-0000-000000000101' and product_id = '20000000-0000-0000-0000-000000000101'), 1::bigint, 'a successful claim creates one entitlement');
select is((select status from public.entitlements where user_id = '10000000-0000-0000-0000-000000000101' and product_id = '20000000-0000-0000-0000-000000000101'), 'paid', 'the entitlement is paid');
select is((select status from public.payment_intents where id = '30000000-0000-0000-0000-000000000101'), 'claimed', 'the payment intent becomes claimed');
select is((select claimed_by from public.payment_intents where id = '30000000-0000-0000-0000-000000000101'), '10000000-0000-0000-0000-000000000101'::uuid, 'the payment intent records its owner');

set local role service_role;

insert into claim_results (label, result)
select 'retry', public.claim_payment_transaction(
  '30000000-0000-0000-0000-000000000101',
  '10000000-0000-0000-0000-000000000101',
  'owner@example.test'
);

insert into claim_results (label, result)
select 'other_user', public.claim_payment_transaction(
  '30000000-0000-0000-0000-000000000101',
  '10000000-0000-0000-0000-000000000102',
  'other@example.test'
);

insert into claim_results (label, result)
select 'email_mismatch', public.claim_payment_transaction(
  '30000000-0000-0000-0000-000000000103',
  '10000000-0000-0000-0000-000000000102',
  'other@example.test'
);

insert into claim_results (label, result)
select 'pending', public.claim_payment_transaction(
  '30000000-0000-0000-0000-000000000104',
  '10000000-0000-0000-0000-000000000103',
  'states@example.test'
);

insert into claim_results (label, result)
select 'failed', public.claim_payment_transaction(
  '30000000-0000-0000-0000-000000000105',
  '10000000-0000-0000-0000-000000000103',
  'states@example.test'
);

insert into claim_results (label, result)
select 'refunded', public.claim_payment_transaction(
  '30000000-0000-0000-0000-000000000106',
  '10000000-0000-0000-0000-000000000103',
  'states@example.test'
);

reset role;

select is((select result ->> 'status' from claim_results where label = 'retry'), 'claimed', 'retry returns the same claimed status');
select is((select result ->> 'docUrl' from claim_results where label = 'retry'), 'https://example.test/document', 'retry returns the same verified document URL');
select is((select count(*) from public.entitlements where user_id = '10000000-0000-0000-0000-000000000101' and product_id = '20000000-0000-0000-0000-000000000101'), 1::bigint, 'retry does not create another entitlement');
select is((select result ->> 'status' from claim_results where label = 'other_user'), 'already_claimed', 'another user cannot claim the payment intent');
select ok(not ((select result from claim_results where label = 'other_user') ? 'docUrl'), 'another user receives no document URL');
select is((select claimed_by from public.payment_intents where id = '30000000-0000-0000-0000-000000000101'), '10000000-0000-0000-0000-000000000101'::uuid, 'another user cannot change claim ownership');
select is((select result ->> 'status' from claim_results where label = 'email_mismatch'), 'email_mismatch', 'email mismatch is rejected');
select ok(not ((select result from claim_results where label = 'email_mismatch') ? 'docUrl'), 'email mismatch receives no document URL');
select is((select status from public.payment_intents where id = '30000000-0000-0000-0000-000000000103'), 'paid', 'email mismatch leaves the payment intent paid');
select is((select count(*) from public.entitlements where user_id = '10000000-0000-0000-0000-000000000102'), 0::bigint, 'email mismatch creates no entitlement');
select is((select result ->> 'status' from claim_results where label = 'pending'), 'pending', 'pending intent is rejected');
select is((select count(*) from public.entitlements where user_id = '10000000-0000-0000-0000-000000000103'), 0::bigint, 'pending intent creates no entitlement');
select is((select result ->> 'status' from claim_results where label = 'failed'), 'failed', 'failed intent is rejected');
select is((select count(*) from public.entitlements where user_id = '10000000-0000-0000-0000-000000000103'), 0::bigint, 'failed intent creates no entitlement');
select is((select result ->> 'status' from claim_results where label = 'refunded'), 'refunded', 'refunded intent is rejected');
select is((select count(*) from public.entitlements where user_id = '10000000-0000-0000-0000-000000000103'), 0::bigint, 'refunded intent creates no entitlement');

set local role anon;
select throws_ok(
  $$select public.claim_payment_transaction('30000000-0000-0000-0000-000000000102', '10000000-0000-0000-0000-000000000101', 'owner@example.test')$$,
  '42501',
  'permission denied for function claim_payment_transaction',
  'anon is denied when calling the RPC directly'
);
reset role;

set local role authenticated;
select throws_ok(
  $$select public.claim_payment_transaction('30000000-0000-0000-0000-000000000102', '10000000-0000-0000-0000-000000000101', 'owner@example.test')$$,
  '42501',
  'permission denied for function claim_payment_transaction',
  'authenticated is denied when calling the RPC directly'
);
reset role;

create function public.test_fail_atomic_entitlement()
returns trigger
language plpgsql
as $$
begin
  raise exception 'forced_entitlement_failure' using errcode = 'P0001';
end;
$$;

create trigger test_fail_atomic_entitlement
before insert or update on public.entitlements
for each row
when (new.user_id = '10000000-0000-0000-0000-000000000104'::uuid)
execute function public.test_fail_atomic_entitlement();

set local role service_role;
select throws_ok(
  $$select public.claim_payment_transaction('30000000-0000-0000-0000-000000000107', '10000000-0000-0000-0000-000000000104', 'entitlement-failure@example.test')$$,
  'P0001',
  'forced_entitlement_failure',
  'entitlement failure aborts the atomic claim'
);
reset role;

select is((select status from public.payment_intents where id = '30000000-0000-0000-0000-000000000107'), 'paid', 'entitlement failure leaves the intent paid');
select is((select count(*) from public.entitlements where user_id = '10000000-0000-0000-0000-000000000104'), 0::bigint, 'entitlement failure leaves no entitlement');

drop trigger test_fail_atomic_entitlement on public.entitlements;
drop function public.test_fail_atomic_entitlement();

create function public.test_fail_atomic_intent_update()
returns trigger
language plpgsql
as $$
begin
  raise exception 'forced_intent_update_failure' using errcode = 'P0001';
end;
$$;

create trigger test_fail_atomic_intent_update
before update on public.payment_intents
for each row
when (new.id = '30000000-0000-0000-0000-000000000108'::uuid)
execute function public.test_fail_atomic_intent_update();

set local role service_role;
select throws_ok(
  $$select public.claim_payment_transaction('30000000-0000-0000-0000-000000000108', '10000000-0000-0000-0000-000000000105', 'intent-failure@example.test')$$,
  'P0001',
  'forced_intent_update_failure',
  'intent update failure aborts the atomic claim'
);
reset role;

select is((select status from public.payment_intents where id = '30000000-0000-0000-0000-000000000108'), 'paid', 'intent update failure leaves the intent paid');
select is((select count(*) from public.entitlements where user_id = '10000000-0000-0000-0000-000000000105'), 0::bigint, 'intent update failure rolls back the entitlement');

drop trigger test_fail_atomic_intent_update on public.payment_intents;
drop function public.test_fail_atomic_intent_update();

select * from finish();

rollback;
