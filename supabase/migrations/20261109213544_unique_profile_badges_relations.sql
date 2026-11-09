DELETE FROM "public"."profile_badges_relations" a
USING "public"."profile_badges_relations" b
WHERE a.profile_id = b.profile_id
  AND a.profile_badge_id = b.profile_badge_id
  AND a.id > b.id;

CREATE UNIQUE INDEX "profile_badges_relations_profile_id_badge_id_key" ON "public"."profile_badges_relations" USING "btree" ("profile_id", "profile_badge_id");
