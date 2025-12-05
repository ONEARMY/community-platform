alter table "public"."profiles" add column "donations_enabled" boolean not null default false;

alter table "public"."tenant_settings" add column "donation_settings" json;
