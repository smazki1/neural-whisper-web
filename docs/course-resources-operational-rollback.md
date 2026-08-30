# Course Resources Operational Rollback

This rollback is intentionally non-destructive. It does not remove the `file`
enum value, drop additive columns, delete the `course-resources` bucket, or
delete bucket metadata or stored objects.

## Production gate before applying the migration

Run these read-only checks immediately before applying the migration:

```sql
select count(*) as course_resource_objects
from storage.objects
where bucket_id = 'course-resources';

select count(*) as file_resources
from public.resources
where type::text = 'file';
```

Both counts must be zero. Stop if either count is non-zero.

## Rollback sequence

1. Restore the previously deployed Frontend release. The current Frontend
   ignores the additive resource columns and the extra RPC result field.
2. Restore the ten-column `public.course_curriculum(uuid)` definition from
   `20260810204235_0ba8f9e7-323f-459e-b19c-04a6e3650bd7.sql`. Preserve
   `EXECUTE` for `PUBLIC`, `anon`, `authenticated`, and `service_role`.
3. Restore the previous `public.resources` policies:
   - `Public can view resources of free or preview lessons`
   - `Enrolled users can view resources`
   - `Owners can modify resources`
4. Drop only the Course Resources access policies introduced by the migration:
   - `Admins can manage course resources` on `storage.objects`
   - `Exact course access can read course resources` on `storage.objects`
   - `Exact course access can view resources` on `public.resources`
   - `Admins can manage resources` on `public.resources`
5. Keep the `course-resources` bucket private and inaccessible through RLS.
   Do not delete the bucket row, object metadata, or stored files.
6. Leave `resource_type.file`, `resources.storage_path`, `resources.position`,
   `resources.file_name`, `resources.mime_type`, `resources.size_bytes`, and
   `lessons.is_upcoming` in place and unused. Leave the supporting constraints
   and indexes in place.

If any file resource or bucket object exists, do not run destructive cleanup.
Disable access through policy restoration and retain all metadata and files for
reconciliation.
