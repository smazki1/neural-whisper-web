set lock_timeout = '5s';

drop policy if exists "Public can view resources of free or preview lessons"
on public.resources;

reset lock_timeout;
