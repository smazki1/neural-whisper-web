set lock_timeout = '5s';

revoke execute
on function public.reorder_lesson_resources(uuid, uuid[])
from public, anon, service_role;

grant execute
on function public.reorder_lesson_resources(uuid, uuid[])
to authenticated;

reset lock_timeout;
