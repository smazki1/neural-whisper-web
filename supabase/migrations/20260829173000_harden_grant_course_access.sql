drop policy if exists "Users can create their own orders"
on public.orders;

drop policy if exists "Users can insert own course access via paid order"
on public.user_course_access;

create policy "Users can insert own course access via paid order"
on public.user_course_access
for insert
to authenticated
with check (
  (select auth.uid()) = user_course_access.user_id
  and exists (
    select 1
    from public.orders o
    where o.id = user_course_access.order_id
      and o.user_id = (select auth.uid())
      and o.status = 'completed'::public.order_status
      and o.product_id = user_course_access.product_id
      and exists (
        select 1
        from public.products_courses pc
        where pc.product_id = o.product_id
          and pc.course_id = user_course_access.course_id
      )
  )
);
