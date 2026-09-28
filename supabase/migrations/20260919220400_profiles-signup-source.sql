alter table "public"."profiles" add column "signup_source" text not null default 'sign_up'::text;
