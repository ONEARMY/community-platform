alter table "public"."profiles" add column "moderation" text;

alter table "public"."profiles" add column "moderation_feedback" text;

CREATE INDEX profiles_moderation_idx ON public.profiles USING btree (tenant_id, moderation) WHERE ((moderation IS NOT NULL) AND (moderation <> 'accepted'::text));
