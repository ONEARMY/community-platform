CREATE TABLE "public"."file_downloads" (
    "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "profile_id" bigint NOT NULL REFERENCES "public"."profiles"("id") ON DELETE CASCADE,
    "content_type" text NOT NULL,
    "content_id" integer NOT NULL,
    "downloaded_at" timestamp with time zone DEFAULT now(),
    "tenant_id" text NOT NULL
);

ALTER TABLE "public"."file_downloads" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON "public"."file_downloads"
AS PERMISSIVE FOR ALL TO public
USING ((tenant_id = ((current_setting('request.headers'::text, true))::json ->> 'x-tenant-id'::text)));

GRANT INSERT, SELECT ON TABLE "public"."file_downloads" TO "authenticated";
GRANT SELECT ON TABLE "public"."file_downloads" TO "service_role";
