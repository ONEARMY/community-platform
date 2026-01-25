alter table "public"."news" add column "published_at" timestamp with time zone;

alter table "public"."projects" add column "published_at" timestamp with time zone;

alter table "public"."questions" add column "published_at" timestamp with time zone;

alter table "public"."research" add column "published_at" timestamp with time zone;

alter table "public"."research_updates" add column "published_at" timestamp with time zone;

-- Backfill existing published content with created_at as published_at
UPDATE "public"."news" SET published_at = created_at WHERE is_draft = false AND published_at IS NULL;
UPDATE "public"."questions" SET published_at = created_at WHERE is_draft = false AND published_at IS NULL;
UPDATE "public"."research" SET published_at = created_at WHERE is_draft = false AND published_at IS NULL;
UPDATE "public"."research_updates" SET published_at = created_at WHERE (is_draft = false OR is_draft IS NULL) AND published_at IS NULL;
UPDATE "public"."projects" SET published_at = created_at WHERE is_draft = false AND published_at IS NULL;

