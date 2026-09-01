alter table public.payment_intents
  add column if not exists request_fingerprint text;

create index if not exists payment_intents_request_fingerprint_created_at_idx
  on public.payment_intents (request_fingerprint, product_id, created_at desc)
  where request_fingerprint is not null;

create or replace function public.create_payment_intent_limited(
  p_product_id uuid,
  p_expected_amount numeric,
  p_request_fingerprint text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_intent_id uuid;
  v_recent_count bigint;
begin
  if p_request_fingerprint is null
    or p_request_fingerprint !~ '^[0-9a-f]{64}$'
  then
    raise exception 'invalid_request_fingerprint' using errcode = '22023';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(p_product_id::text || ':' || p_request_fingerprint, 0)
  );

  delete from public.payment_intents
  where status = 'pending'
    and expires_at < pg_catalog.now();

  select count(*)
  into v_recent_count
  from public.payment_intents
  where product_id = p_product_id
    and request_fingerprint = p_request_fingerprint
    and created_at >= pg_catalog.now() - interval '10 minutes';

  if v_recent_count >= 5 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;

  insert into public.payment_intents (
    product_id,
    expected_amount,
    request_fingerprint
  )
  values (
    p_product_id,
    p_expected_amount,
    p_request_fingerprint
  )
  returning id into v_intent_id;

  return v_intent_id;
end;
$$;

revoke all on function public.create_payment_intent_limited(uuid, numeric, text)
  from public, anon, authenticated;
grant execute on function public.create_payment_intent_limited(uuid, numeric, text)
  to service_role;
