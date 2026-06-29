ALTER TABLE public.questions
ADD COLUMN accepted_answer_id bigint REFERENCES public.comments(id) ON DELETE SET NULL;

CREATE INDEX questions_accepted_answer_id_idx ON public.questions USING btree (accepted_answer_id);
