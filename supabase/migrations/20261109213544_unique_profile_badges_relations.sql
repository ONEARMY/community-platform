CREATE UNIQUE INDEX "profile_badges_relations_profile_id_badge_id_key" ON "public"."profile_badges_relations" USING "btree" ("profile_id", "profile_badge_id");
