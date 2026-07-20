ALTER TABLE "public"."categories" 
ADD COLUMN IF NOT EXISTS "image_url" "text";

ALTER TABLE "public"."categories" 
ADD COLUMN IF NOT EXISTS "description" "text";
