ALTER TABLE ONLY "public"."notifications_preferences"
    ADD CONSTRAINT "notifications_preferences_user_id_key" UNIQUE ("user_id");
