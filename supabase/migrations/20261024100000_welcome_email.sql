alter table "public"."tenant_settings" add column "welcome_email_content" jsonb;

alter table "public"."tenant_settings" add column "welcome_email_from_name" text;

alter table "public"."tenant_settings" add column "welcome_email_subject" text;

