drop policy "Enrolled users can view courses" on public.courses;
drop policy "Enrolled users can view modules" on public.modules;
drop policy "Enrolled users can view lessons" on public.lessons;

create policy "Enrolled users can view courses"
on public.courses
for select
to authenticated
using (
  exists (
    select 1
    from public.user_course_access uca
    where uca.course_id = courses.id
      and uca.user_id = (select auth.uid())
  )
  or exists (
    select 1
    from public.entitlements e
    join public.products p on p.id = e.product_id
    where e.user_id = (select auth.uid())
      and e.status = 'paid'
      and p.course_id = courses.id
  )
);

create policy "Enrolled users can view modules"
on public.modules
for select
to authenticated
using (
  exists (
    select 1
    from public.user_course_access uca
    where uca.course_id = modules.course_id
      and uca.user_id = (select auth.uid())
  )
  or exists (
    select 1
    from public.entitlements e
    join public.products p on p.id = e.product_id
    where e.user_id = (select auth.uid())
      and e.status = 'paid'
      and p.course_id = modules.course_id
  )
);

create policy "Enrolled users can view lessons"
on public.lessons
for select
to authenticated
using (
  exists (
    select 1
    from public.modules m
    where m.id = lessons.module_id
      and (
        exists (
          select 1
          from public.user_course_access uca
          where uca.course_id = m.course_id
            and uca.user_id = (select auth.uid())
        )
        or exists (
          select 1
          from public.entitlements e
          join public.products p on p.id = e.product_id
          where e.user_id = (select auth.uid())
            and e.status = 'paid'
            and p.course_id = m.course_id
        )
      )
  )
);
