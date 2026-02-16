alter table "public"."tenant_settings" add column "academy_resource" text;

alter table "public"."tenant_settings" add column "library_heading" text;

alter table "public"."tenant_settings" add column "no_messaging" boolean not null default false;

alter table "public"."tenant_settings" add column "patreon_id" text;

alter table "public"."tenant_settings" add column "profile_guidelines" text;

alter table "public"."tenant_settings" add column "questions_guidelines" text;

alter table "public"."tenant_settings" add column "supported_modules" text default 'library,map,research,academy,user,question,news'::text;
