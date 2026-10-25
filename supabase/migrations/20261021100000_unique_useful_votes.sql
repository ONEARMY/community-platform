CREATE UNIQUE INDEX "useful_votes_content_type_content_id_user_id_key" ON "public"."useful_votes" USING "btree" ("content_type", "content_id", "user_id");
