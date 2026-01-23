set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_subscribed_users_emails_to_notify(p_content_id bigint, p_content_type text)
 RETURNS TABLE(
    email character varying,
    profile_id bigint,
    profile_created_at timestamp with time zone,
    display_name character varying,
    comments boolean,
    replies boolean,
    research_updates boolean,
    is_unsubscribed boolean
)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN QUERY
    SELECT DISTINCT ON (p.id)
        u.email,
        p.id AS profile_id,
        p.created_at AS profile_created_at,
        p.display_name::character varying,
        np.comments,
        np.replies,
        np.research_updates,
        np.is_unsubscribed
    FROM subscribers s
    INNER JOIN profiles p ON s.user_id = p.id
    INNER JOIN auth.users u ON p.auth_id = u.id
    LEFT JOIN notifications_preferences np ON np.user_id = p.id
    WHERE s.content_id = p_content_id AND s.content_type = p_content_type
    ORDER BY p.id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_comment_count()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$BEGIN
  IF (TG_OP = 'INSERT') THEN
    IF NEW.source_type IS NOT NULL AND NEW.source_id IS NOT NULL AND (NEW.deleted IS NULL OR NEW.deleted = false) THEN
      IF NEW.source_type = 'questions' THEN
        UPDATE questions SET comment_count = COALESCE(comment_count, 0) + 1
        WHERE id = NEW.source_id;
      ELSIF NEW.source_type = 'research_updates' THEN
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
        ELSIF OLD.source_type = 'research_updates' THEN
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
        ELSIF NEW.source_type = 'research_updates' THEN
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
      ELSIF OLD.source_type = 'research_updates' THEN
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

ALTER TYPE public.notification_content_types ADD VALUE IF NOT EXISTS 'research_updates';
ALTER TYPE public.notification_content_types ADD VALUE IF NOT EXISTS 'comments';
ALTER TYPE public.notification_content_types ADD VALUE IF NOT EXISTS 'projects';

ALTER TYPE public.notification_source_content_type ADD VALUE IF NOT EXISTS 'projects';
ALTER TYPE public.notification_source_content_type ADD VALUE IF NOT EXISTS 'research_updates';

ALTER TYPE public.notification_action_types ADD VALUE IF NOT EXISTS 'newReply';
