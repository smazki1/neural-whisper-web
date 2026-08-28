create table public.payment_intents (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'claimed', 'failed')),
  expected_amount numeric(12, 2) not null check (expected_amount > 0),
  amount_paid numeric(12, 2),
  buyer_email text,
  icount_doc_number text,
  icount_confirmation_code text,
  icount_doc_url text,
  failure_reason text,
  claimed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '24 hours'),
  paid_at timestamptz,
  claimed_at timestamptz
);

create index payment_intents_product_id_idx
  on public.payment_intents(product_id);
create index payment_intents_status_created_at_idx
  on public.payment_intents(status, created_at desc);
create unique index payment_intents_icount_doc_number_idx
  on public.payment_intents(icount_doc_number)
  where icount_doc_number is not null;

-- A user should have one durable access record per product. This also makes
-- the post-login claim idempotent under retries and concurrent browser tabs.
do $$
begin
  if to_regclass('public.entitlements') is not null then
    create unique index if not exists entitlements_user_product_idx
      on public.entitlements(user_id, product_id);
  end if;
end
$$;

alter table public.payment_intents enable row level security;

-- Payment intents contain purchaser data and are only accessed by service-role
-- Edge Functions. There are intentionally no anon/authenticated RLS policies.
revoke all on table public.payment_intents from anon, authenticated;
