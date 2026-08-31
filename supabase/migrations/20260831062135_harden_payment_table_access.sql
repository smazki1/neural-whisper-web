revoke all privileges on table public.enrollments
from public, anon, authenticated, service_role;

grant select, insert on table public.enrollments to authenticated;
grant select, insert, update, delete on table public.enrollments to service_role;

drop policy if exists "users insert own enrollments" on public.enrollments;
create policy "users insert own enrollments"
  on public.enrollments
  as permissive
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "users see own enrollments" on public.enrollments;
create policy "users see own enrollments"
  on public.enrollments
  as permissive
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create index if not exists enrollments_course_id_idx
  on public.enrollments (course_id);

revoke all privileges on table public.icount_webhook_log
from public, anon, authenticated, service_role;

grant select on table public.icount_webhook_log to authenticated;
grant select, insert on table public.icount_webhook_log to service_role;

drop policy if exists "admin read webhook log" on public.icount_webhook_log;
create policy "admin read webhook log"
  on public.icount_webhook_log
  as permissive
  for select
  to authenticated
  using (
    public.has_role((select auth.uid()), 'admin'::public.app_role)
  );
