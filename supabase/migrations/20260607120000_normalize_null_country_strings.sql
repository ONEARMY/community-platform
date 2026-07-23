UPDATE "public"."profiles"
SET "country" = NULL
WHERE lower(trim("country")) IN ('null', 'undefined');
