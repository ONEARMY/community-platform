alter table "public"."tags" add column "modified_at" date;

CREATE OR REPLACE FUNCTION public.update_comment_count()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
  IF (TG_OP = 'INSERT') THEN
    IF NEW.source_type IS NOT NULL AND NEW.source_id IS NOT NULL THEN
      IF NEW.source_type = 'questions' THEN
        UPDATE questions SET comment_count = comment_count + 1
        WHERE id = NEW.source_id;
      ELSIF NEW.source_type = 'research' THEN
        UPDATE research SET comment_count = comment_count + 1
        WHERE id = NEW.source_id;
      ELSIF NEW.source_type = 'news' THEN
        UPDATE news SET comment_count = comment_count + 1
        WHERE id = NEW.source_id;
      ELSIF NEW.source_type = 'howtos' THEN
        UPDATE howtos SET comment_count = comment_count + 1
        WHERE id = NEW.source_id;
      END IF;
    ELSE
      RAISE NOTICE 'Warning: source_type or source_id is NULL';
    END IF;

  ELSIF (TG_OP = 'DELETE') THEN
    IF OLD.source_type IS NOT NULL AND OLD.source_id IS NOT NULL THEN
      IF OLD.source_type = 'questions' THEN
        UPDATE questions SET comment_count = comment_count - 1
        WHERE id = OLD.source_id;
      ELSIF OLD.source_type = 'research' THEN
        UPDATE research SET comment_count = comment_count - 1
      ELSIF OLD.source_type = 'news' THEN
        UPDATE news SET comment_count = comment_count - 1
        WHERE id = OLD.source_id;
      ELSIF OLD.source_type = 'howtos' THEN
        UPDATE howtos SET comment_count = comment_count - 1
        WHERE id = OLD.source_id;
      END IF;
    ELSE
      RAISE NOTICE 'Warning: OLD.source_type or OLD.source_id is NULL';
    END IF;
  END IF;

  -- Explicit return for the trigger function
  RETURN NULL;
END;$function$
;

CREATE OR REPLACE TRIGGER update_comment_count AFTER INSERT OR DELETE ON public.comments FOR EACH ROW EXECUTE FUNCTION update_comment_count();

create policy "tenant_isolation"
on "storage"."objects"
as permissive
for all
to public
using ((bucket_id = ((current_setting('request.headers'::text, true))::json ->> 'x-tenant-id'::text)));
