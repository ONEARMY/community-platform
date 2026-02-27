alter table "public"."tenant_settings" add column "site_description" text;
alter table "public"."tenant_settings" add column "color_primary" text;
alter table "public"."tenant_settings" add column "color_primary_hover" text;
alter table "public"."tenant_settings" add column "color_accent" text;
alter table "public"."tenant_settings" add column "color_accent_hover" text;
alter table "public"."tenant_settings" add column "show_impact" boolean;
alter table "public"."tenant_settings" add column "create_research_roles" text[];
