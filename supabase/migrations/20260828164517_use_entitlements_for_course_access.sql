-- Paid entitlements remain valid even after a product is unpublished. This
-- SELECT-only policy lets the owner of a paid entitlement resolve exactly the
-- purchased product without broadening access to other products.
drop policy if exists "Entitled users can view purchased products" on public.products;
create policy "Entitled users can view purchased products"
on public.products
for select
to authenticated
using (
  exists (
    select 1
    from public.entitlements e
    where e.product_id = products.id
      and e.user_id = (select auth.uid())
      and e.status = 'paid'
  )
);

drop policy if exists "Enrolled users can view courses" on public.courses;
drop policy if exists "Enrolled users can view modules" on public.modules;
drop policy if exists "Enrolled users can view lessons" on public.lessons;
drop policy if exists "Enrolled users can view resources" on public.resources;

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

create policy "Enrolled users can view resources"
on public.resources
for select
to authenticated
using (
  exists (
    select 1
    from public.lessons l
    join public.modules m on m.id = l.module_id
    where l.id = resources.lesson_id
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
