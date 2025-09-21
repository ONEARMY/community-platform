CREATE INDEX idx_map_pins_moderation ON public.map_pins USING btree (moderation);

CREATE INDEX idx_map_pins_moderation_tenant ON public.map_pins USING btree (moderation, tenant_id);

CREATE INDEX idx_map_pins_tenant_id ON public.map_pins USING btree (tenant_id);

CREATE INDEX idx_profile_badges_relations_badge_id ON public.profile_badges_relations USING btree (profile_badge_id);

CREATE INDEX idx_profile_badges_relations_profile_id ON public.profile_badges_relations USING btree (profile_id);

CREATE INDEX idx_profile_badges_relations_tenant_id ON public.profile_badges_relations USING btree (tenant_id);

CREATE INDEX idx_profile_badges_tenant_id ON public.profile_badges USING btree (tenant_id);

CREATE INDEX idx_profile_tags_relations_profile_id ON public.profile_tags_relations USING btree (profile_id);

CREATE INDEX idx_profile_tags_relations_tag_id ON public.profile_tags_relations USING btree (profile_tag_id);

CREATE INDEX idx_profile_tags_relations_tenant_id ON public.profile_tags_relations USING btree (tenant_id);

CREATE INDEX idx_profile_tags_tenant_id ON public.profile_tags USING btree (tenant_id);

CREATE INDEX idx_profile_types_tenant_id ON public.profile_types USING btree (tenant_id);

CREATE INDEX idx_profiles_profile_type ON public.profiles USING btree (profile_type);


