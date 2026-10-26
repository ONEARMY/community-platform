CREATE INDEX notifications_owned_by_id_idx ON public.notifications USING btree (owned_by_id);

CREATE INDEX subscribers_content_idx ON public.subscribers USING btree (content_id, content_type, user_id);
