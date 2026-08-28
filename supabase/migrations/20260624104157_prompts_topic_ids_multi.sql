-- Allow a prompt to belong to multiple topics. Backfill from the single topic_id.
alter table public.prompts add column if not exists topic_ids uuid[] not null default '{}';
update public.prompts
  set topic_ids = array[topic_id]::uuid[]
  where topic_id is not null
    and (topic_ids is null or array_length(topic_ids, 1) is null);
create index if not exists prompts_topic_ids_idx on public.prompts using gin (topic_ids);;
