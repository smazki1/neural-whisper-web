drop policy "Users can insert their own courses" on public.courses;
drop policy "Users can update their own courses" on public.courses;
drop policy "Users can delete their own courses" on public.courses;
drop policy "Owners can modify modules" on public.modules;
drop policy "Owners can modify lessons" on public.lessons;
create policy "Admins can insert courses"
on public.courses
for insert
to authenticated
with check ((select public.has_role(auth.uid(), 'admin'::public.app_role)));
create policy "Admins can update courses"
on public.courses
for update
to authenticated
using ((select public.has_role(auth.uid(), 'admin'::public.app_role)))
with check ((select public.has_role(auth.uid(), 'admin'::public.app_role)));
create policy "Admins can delete courses"
on public.courses
for delete
to authenticated
using ((select public.has_role(auth.uid(), 'admin'::public.app_role)));
create policy "Admins can insert modules"
on public.modules
for insert
to authenticated
with check ((select public.has_role(auth.uid(), 'admin'::public.app_role)));
create policy "Admins can update modules"
on public.modules
for update
to authenticated
using ((select public.has_role(auth.uid(), 'admin'::public.app_role)))
with check ((select public.has_role(auth.uid(), 'admin'::public.app_role)));
create policy "Admins can delete modules"
on public.modules
for delete
to authenticated
using ((select public.has_role(auth.uid(), 'admin'::public.app_role)));
create policy "Admins can insert lessons"
on public.lessons
for insert
to authenticated
with check ((select public.has_role(auth.uid(), 'admin'::public.app_role)));
create policy "Admins can update lessons"
on public.lessons
for update
to authenticated
using ((select public.has_role(auth.uid(), 'admin'::public.app_role)))
with check ((select public.has_role(auth.uid(), 'admin'::public.app_role)));
create policy "Admins can delete lessons"
on public.lessons
for delete
to authenticated
using ((select public.has_role(auth.uid(), 'admin'::public.app_role)));
