drop policy "tenant_isolation" on "public"."categories";

drop policy "tenant_isolation" on "public"."comments";

drop policy "tenant_isolation" on "public"."map_pins";

drop policy "tenant_isolation" on "public"."map_settings";

drop policy "tenant_isolation" on "public"."messages";

drop policy "tenant_isolation" on "public"."news";

drop policy "tenant_isolation" on "public"."notifications";

drop policy "tenant_isolation" on "public"."notifications_preferences";

drop policy "tenant_isolation" on "public"."patreon_settings";

drop policy "tenant_isolation" on "public"."profile_badges";

drop policy "tenant_isolation" on "public"."profile_badges_relations";

drop policy "tenant_isolation" on "public"."profile_tags";

drop policy "tenant_isolation" on "public"."profile_tags_relations";

drop policy "tenant_isolation" on "public"."profile_types";

drop policy "tenant_isolation" on "public"."profiles";

drop policy "tenant_isolation" on "public"."project_steps";

drop policy "tenant_isolation" on "public"."projects";

drop policy "tenant_isolation" on "public"."questions";

drop policy "tenant_isolation" on "public"."research";

drop policy "tenant_isolation" on "public"."research_updates";

drop policy "tenant_isolation" on "public"."subscribers";

drop policy "tenant_isolation" on "public"."tags";

drop policy "tenant_isolation" on "public"."tenant_settings";

drop policy "tenant_isolation" on "public"."useful_votes";

create policy "tenant_isolation"
on "public"."categories"
as permissive
for all
to public
using ((tenant_id = ( SELECT ((current_setting('request.headers'::text, true))::json ->> 'x-tenant-id'::text))));


create policy "tenant_isolation"
on "public"."comments"
as permissive
for all
to public
using ((tenant_id = ( SELECT ((current_setting('request.headers'::text, true))::json ->> 'x-tenant-id'::text))));


create policy "tenant_isolation"
on "public"."map_pins"
as permissive
for all
to public
using ((tenant_id = ( SELECT ((current_setting('request.headers'::text, true))::json ->> 'x-tenant-id'::text))));


create policy "tenant_isolation"
on "public"."map_settings"
as permissive
for all
to public
using ((tenant_id = ( SELECT ((current_setting('request.headers'::text, true))::json ->> 'x-tenant-id'::text))));


create policy "tenant_isolation"
on "public"."messages"
as permissive
for all
to authenticated
using ((tenant_id = ( SELECT ((current_setting('request.headers'::text, true))::json ->> 'x-tenant-id'::text))));


create policy "tenant_isolation"
on "public"."news"
as permissive
for all
to public
using ((tenant_id = ( SELECT ((current_setting('request.headers'::text, true))::json ->> 'x-tenant-id'::text))));


create policy "tenant_isolation"
on "public"."notifications"
as permissive
for all
to public
using ((tenant_id = ( SELECT ((current_setting('request.headers'::text, true))::json ->> 'x-tenant-id'::text))));


create policy "tenant_isolation"
on "public"."notifications_preferences"
as permissive
for all
to public
using ((tenant_id = ( SELECT ((current_setting('request.headers'::text, true))::json ->> 'x-tenant-id'::text))));


create policy "tenant_isolation"
on "public"."patreon_settings"
as permissive
for all
to public
using ((tenant_id = ( SELECT ((current_setting('request.headers'::text, true))::json ->> 'x-tenant-id'::text))));


create policy "tenant_isolation"
on "public"."profile_badges"
as permissive
for all
to public
using ((tenant_id = ( SELECT ((current_setting('request.headers'::text, true))::json ->> 'x-tenant-id'::text))));


create policy "tenant_isolation"
on "public"."profile_badges_relations"
as permissive
for all
to public
using ((tenant_id = ( SELECT ((current_setting('request.headers'::text, true))::json ->> 'x-tenant-id'::text))));


create policy "tenant_isolation"
on "public"."profile_tags"
as permissive
for all
to public
using ((tenant_id = ( SELECT ((current_setting('request.headers'::text, true))::json ->> 'x-tenant-id'::text))));


create policy "tenant_isolation"
on "public"."profile_tags_relations"
as permissive
for all
to public
using ((tenant_id = ( SELECT ((current_setting('request.headers'::text, true))::json ->> 'x-tenant-id'::text))));


create policy "tenant_isolation"
on "public"."profile_types"
as permissive
for all
to public
using ((tenant_id = ( SELECT ((current_setting('request.headers'::text, true))::json ->> 'x-tenant-id'::text))));


create policy "tenant_isolation"
on "public"."profiles"
as permissive
for all
to public
using ((tenant_id = ( SELECT ((current_setting('request.headers'::text, true))::json ->> 'x-tenant-id'::text))));


create policy "tenant_isolation"
on "public"."project_steps"
as permissive
for all
to public
using ((tenant_id = ( SELECT ((current_setting('request.headers'::text, true))::json ->> 'x-tenant-id'::text))));


create policy "tenant_isolation"
on "public"."projects"
as permissive
for all
to public
using ((tenant_id = ( SELECT ((current_setting('request.headers'::text, true))::json ->> 'x-tenant-id'::text))));


create policy "tenant_isolation"
on "public"."questions"
as permissive
for all
to public
using ((tenant_id = ( SELECT ((current_setting('request.headers'::text, true))::json ->> 'x-tenant-id'::text))));


create policy "tenant_isolation"
on "public"."research"
as permissive
for all
to public
using ((tenant_id = ( SELECT ((current_setting('request.headers'::text, true))::json ->> 'x-tenant-id'::text))));


create policy "tenant_isolation"
on "public"."research_updates"
as permissive
for all
to public
using ((tenant_id = ( SELECT ((current_setting('request.headers'::text, true))::json ->> 'x-tenant-id'::text))));


create policy "tenant_isolation"
on "public"."subscribers"
as permissive
for all
to public
using ((tenant_id = ( SELECT ((current_setting('request.headers'::text, true))::json ->> 'x-tenant-id'::text))));


create policy "tenant_isolation"
on "public"."tags"
as permissive
for all
to public
using ((tenant_id = ( SELECT ((current_setting('request.headers'::text, true))::json ->> 'x-tenant-id'::text))));


create policy "tenant_isolation"
on "public"."tenant_settings"
as permissive
for all
to public
using ((tenant_id = ( SELECT ((current_setting('request.headers'::text, true))::json ->> 'x-tenant-id'::text))));


create policy "tenant_isolation"
on "public"."useful_votes"
as permissive
for all
to public
using ((tenant_id = ( SELECT ((current_setting('request.headers'::text, true))::json ->> 'x-tenant-id'::text))));



