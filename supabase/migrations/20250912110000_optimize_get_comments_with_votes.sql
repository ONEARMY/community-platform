DROP INDEX IF EXISTS public.comments_created_at_source_type_source_id_tenant_id_idx;

CREATE INDEX IF NOT EXISTS comments_source_type_source_id_created_at_idx ON public.comments USING btree (source_type, source_id, created_at);

CREATE INDEX IF NOT EXISTS useful_votes_comments_content_id_idx ON public.useful_votes USING btree (content_id)
WHERE
  content_type = 'comments';

CREATE INDEX IF NOT EXISTS useful_votes_comments_user_id_content_id_idx ON public.useful_votes USING btree (user_id, content_id)
WHERE
  content_type = 'comments';