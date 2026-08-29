-- User-authorized fix: allow anonymous (public) reads of tables whose RLS
-- policies reference has_role(). For anon, auth.uid() is null so has_role
-- returns false — this does NOT grant any elevated access, it only stops the
-- "permission denied for function has_role" error on public SELECTs.
grant execute on function public.has_role(uuid, app_role) to anon;;
