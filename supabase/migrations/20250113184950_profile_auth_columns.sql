alter table "public"."profiles" add column "auth_id" uuid;

alter table "public"."profiles" add column "legacy_id" text;

CREATE UNIQUE INDEX profiles_auth_id_key ON public.profiles USING btree (auth_id);

alter table "public"."profiles" add constraint "profiles_auth_id_fkey" FOREIGN KEY (auth_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_auth_id_fkey";

alter table "public"."profiles" add constraint "profiles_auth_id_key" UNIQUE using index "profiles_auth_id_key";


