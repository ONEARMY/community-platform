CREATE INDEX IF NOT EXISTS profiles_tenant_created_at_idx ON public.profiles (tenant_id, created_at DESC);

CREATE INDEX IF NOT EXISTS projects_created_by_idx ON public.projects (created_by);

CREATE INDEX IF NOT EXISTS research_created_by_idx ON public.research (created_by);

CREATE INDEX IF NOT EXISTS research_updates_created_by_idx ON public.research_updates (created_by);

CREATE INDEX IF NOT EXISTS questions_created_by_idx ON public.questions (created_by);

CREATE INDEX IF NOT EXISTS useful_votes_content_type_content_id_idx ON public.useful_votes (content_type, content_id);

CREATE INDEX IF NOT EXISTS profile_tags_relations_profile_tenant_idx ON public.profile_tags_relations (profile_id, tenant_id);

CREATE INDEX IF NOT EXISTS profile_badges_relations_profile_tenant_idx ON public.profile_badges_relations (profile_id, tenant_id);