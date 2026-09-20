alter table public.payment_intents
  drop constraint if exists payment_intents_status_check;

alter table public.payment_intents
  add constraint payment_intents_status_check
  check (status in ('pending', 'paid', 'claimed', 'failed', 'refunded'));

create or replace function public.claim_payment_transaction(
  p_intent_id uuid,
  p_user_id uuid,
  p_user_email text
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_email_trim_chars constant text := U&'\0009\000A\000B\000C\000D\0020\00A0\1680\2000\2001\2002\2003\2004\2005\2006\2007\2008\2009\200A\2028\2029\202F\205F\3000\FEFF';
  v_product_id uuid;
  v_status text;
  v_buyer_email text;
  v_amount_paid numeric;
  v_icount_doc_number text;
  v_icount_confirmation_code text;
  v_icount_doc_url text;
  v_claimed_by uuid;
  v_product_slug text;
  v_claimed_intent_id uuid;
  v_claimed_at timestamptz := pg_catalog.now();
begin
  select
    payment_intents.product_id,
    payment_intents.status,
    payment_intents.buyer_email,
    payment_intents.amount_paid,
    payment_intents.icount_doc_number,
    payment_intents.icount_confirmation_code,
    payment_intents.icount_doc_url,
    payment_intents.claimed_by,
    products.slug
  into
    v_product_id,
    v_status,
    v_buyer_email,
    v_amount_paid,
    v_icount_doc_number,
    v_icount_confirmation_code,
    v_icount_doc_url,
    v_claimed_by,
    v_product_slug
  from public.payment_intents
  join public.products
    on products.id = payment_intents.product_id
  where payment_intents.id = p_intent_id
  for update of payment_intents;

  if not found then
    return pg_catalog.jsonb_build_object('status', 'not_found');
  end if;

  if v_status = 'claimed' then
    if v_claimed_by is distinct from p_user_id then
      return pg_catalog.jsonb_build_object('status', 'already_claimed');
    end if;

    return pg_catalog.jsonb_build_object(
      'status', 'claimed',
      'productSlug', v_product_slug,
      'docUrl', v_icount_doc_url
    );
  end if;

  if v_status <> 'paid' then
    return pg_catalog.jsonb_build_object('status', v_status);
  end if;

  if p_user_id is null
    or p_user_email is null
    or pg_catalog.btrim(p_user_email, v_email_trim_chars) = ''
    or pg_catalog.lower(pg_catalog.btrim(v_buyer_email, v_email_trim_chars))
      is distinct from pg_catalog.lower(pg_catalog.btrim(p_user_email, v_email_trim_chars))
  then
    return pg_catalog.jsonb_build_object('status', 'email_mismatch');
  end if;

  insert into public.entitlements (
    user_id,
    product_id,
    status,
    amount_paid,
    icount_doc_number,
    icount_confirmation_code,
    icount_doc_url,
    granted_at
  )
  values (
    p_user_id,
    v_product_id,
    'paid',
    v_amount_paid,
    v_icount_doc_number,
    v_icount_confirmation_code,
    v_icount_doc_url,
    v_claimed_at
  )
  on conflict (user_id, product_id) do update
  set
    status = excluded.status,
    amount_paid = excluded.amount_paid,
    icount_doc_number = excluded.icount_doc_number,
    icount_confirmation_code = excluded.icount_confirmation_code,
    icount_doc_url = excluded.icount_doc_url,
    granted_at = excluded.granted_at;

  update public.payment_intents
  set
    status = 'claimed',
    claimed_by = p_user_id,
    claimed_at = v_claimed_at
  where id = p_intent_id
    and status = 'paid'
  returning id into v_claimed_intent_id;

  if v_claimed_intent_id is null then
    raise exception 'payment_intent_state_changed' using errcode = '40001';
  end if;

  return pg_catalog.jsonb_build_object(
    'status', 'claimed',
    'productSlug', v_product_slug,
    'docUrl', v_icount_doc_url
  );
end;
$$;

revoke all on function public.claim_payment_transaction(uuid, uuid, text)
  from public, anon, authenticated;
grant execute on function public.claim_payment_transaction(uuid, uuid, text)
  to service_role;
