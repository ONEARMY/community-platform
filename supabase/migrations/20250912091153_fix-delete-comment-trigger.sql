drop trigger if exists "update_comment_count" on "public"."comments";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_comment_count()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
  IF (TG_OP = 'INSERT') THEN
    IF NEW.source_type IS NOT NULL AND NEW.source_id IS NOT NULL AND (NEW.deleted IS NULL OR NEW.deleted = false) THEN
      IF NEW.source_type = 'questions' THEN
        UPDATE questions SET comment_count = COALESCE(comment_count, 0) + 1
        WHERE id = NEW.source_id;
      ELSIF NEW.source_type = 'research_update' THEN
        UPDATE research_updates SET comment_count = COALESCE(comment_count, 0) + 1
        WHERE id = NEW.source_id;
      ELSIF NEW.source_type = 'news' THEN
        UPDATE news SET comment_count = COALESCE(comment_count, 0) + 1
        WHERE id = NEW.source_id;
      ELSIF NEW.source_type = 'projects' THEN
        UPDATE projects SET comment_count = COALESCE(comment_count, 0) + 1
        WHERE id = NEW.source_id;
      END IF;
    ELSE
      RAISE NOTICE 'Warning: source_type or source_id is NULL, or comment is deleted';
    END IF;
  ELSIF (TG_OP = 'UPDATE') THEN
    IF (COALESCE(OLD.deleted, false) = false AND NEW.deleted = true) THEN
      IF OLD.source_type IS NOT NULL AND OLD.source_id IS NOT NULL THEN
        IF OLD.source_type = 'questions' THEN
          UPDATE questions SET comment_count = GREATEST(COALESCE(comment_count, 0) - 1, 0)
          WHERE id = OLD.source_id;
        ELSIF OLD.source_type = 'research_update' THEN
          UPDATE research_updates SET comment_count = GREATEST(COALESCE(comment_count, 0) - 1, 0)
          WHERE id = OLD.source_id;
        ELSIF OLD.source_type = 'news' THEN
          UPDATE news SET comment_count = GREATEST(COALESCE(comment_count, 0) - 1, 0)
          WHERE id = OLD.source_id;
        ELSIF OLD.source_type = 'projects' THEN
          UPDATE projects SET comment_count = GREATEST(COALESCE(comment_count, 0) - 1, 0)
          WHERE id = OLD.source_id;
        END IF;
      ELSE
        RAISE NOTICE 'Warning: OLD.source_type or OLD.source_id is NULL';
      END IF;
    ELSIF (OLD.deleted = true AND COALESCE(NEW.deleted, false) = false) THEN
      IF NEW.source_type IS NOT NULL AND NEW.source_id IS NOT NULL THEN
        IF NEW.source_type = 'questions' THEN
          UPDATE questions SET comment_count = COALESCE(comment_count, 0) + 1
          WHERE id = NEW.source_id;
        ELSIF NEW.source_type = 'research_update' THEN
          UPDATE research_updates SET comment_count = COALESCE(comment_count, 0) + 1
          WHERE id = NEW.source_id;
        ELSIF NEW.source_type = 'news' THEN
          UPDATE news SET comment_count = COALESCE(comment_count, 0) + 1
          WHERE id = NEW.source_id;
        ELSIF NEW.source_type = 'projects' THEN
          UPDATE projects SET comment_count = COALESCE(comment_count, 0) + 1
          WHERE id = NEW.source_id;
        END IF;
      ELSE
        RAISE NOTICE 'Warning: NEW.source_type or NEW.source_id is NULL';
      END IF;
    END IF;
  ELSIF (TG_OP = 'DELETE') THEN
    IF OLD.source_type IS NOT NULL AND OLD.source_id IS NOT NULL THEN
      IF OLD.source_type = 'questions' THEN
        UPDATE questions SET comment_count = GREATEST(COALESCE(comment_count, 0) - 1, 0)
        WHERE id = OLD.source_id;
      ELSIF OLD.source_type = 'research_update' THEN
        UPDATE research_updates SET comment_count = GREATEST(COALESCE(comment_count, 0) - 1, 0)
        WHERE id = OLD.source_id;
      ELSIF OLD.source_type = 'news' THEN
        UPDATE news SET comment_count = GREATEST(COALESCE(comment_count, 0) - 1, 0)
        WHERE id = OLD.source_id;
      ELSIF OLD.source_type = 'projects' THEN
        UPDATE projects SET comment_count = GREATEST(COALESCE(comment_count, 0) - 1, 0)
        WHERE id = OLD.source_id;
      END IF;
    ELSE
      RAISE NOTICE 'Warning: OLD.source_type or OLD.source_id is NULL';
    END IF;
  END IF;
  
  RETURN NULL;
END;$function$
;

CREATE TRIGGER update_comment_count AFTER INSERT OR DELETE OR UPDATE ON public.comments FOR EACH ROW EXECUTE FUNCTION update_comment_count();


