create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select _user_id is not null
    and _user_id = auth.uid()
    and exists (
      select 1
      from public.user_roles
      where user_id = _user_id
        and role = _role
    );
$$;

comment on function public.has_role(uuid, public.app_role) is
  'Checks only the current JWT user role; prevents probing roles for arbitrary user IDs.';;
