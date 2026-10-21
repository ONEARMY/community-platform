CREATE OR REPLACE FUNCTION "public"."update_vote_count"()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
    BEGIN
        IF TG_OP = 'INSERT' THEN
            UPDATE poll_options SET vote_count = vote_count + 1 WHERE id = NEW.poll_option_id;
        ELSE
            UPDATE poll_options SET vote_count = vote_count - 1 WHERE id = OLD.poll_option_id;
        END IF;

        RETURN COALESCE(NEW, OLD);
    END;
$function$
;

CREATE OR REPLACE FUNCTION "public"."cast_poll_vote"(p_poll_id bigint, p_option_ids bigint[], p_profile_id bigint, p_tenant_id text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
    DECLARE
        v_single_choice boolean;
    BEGIN
        PERFORM pg_advisory_xact_lock(hashtextextended(format('poll_vote:%s:%s', p_poll_id, p_profile_id), 0));

        SELECT single_choice INTO v_single_choice FROM polls WHERE id = p_poll_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Poll not found';
        END IF;

        IF cardinality(p_option_ids) = 0 OR (v_single_choice AND cardinality(p_option_ids) > 1) THEN
            RAISE EXCEPTION 'Invalid number of options';
        END IF;

        IF (SELECT COUNT(*) FROM poll_options WHERE id = ANY(p_option_ids) AND poll_id = p_poll_id) <> cardinality(p_option_ids) THEN
            RAISE EXCEPTION 'One or more options do not belong to this poll';
        END IF;

        IF EXISTS (
            SELECT 1
            FROM poll_votes v
                     JOIN poll_options o ON o.id = v.poll_option_id
            WHERE v.profile_id = p_profile_id
              AND o.poll_id = p_poll_id
        ) THEN
            RAISE EXCEPTION 'This user already voted for this poll';
        END IF;

        INSERT INTO poll_votes (poll_option_id, profile_id, tenant_id)
        SELECT unnest(p_option_ids), p_profile_id, p_tenant_id;
    END;
$function$
;

UPDATE "public"."poll_options" o
SET vote_count = (SELECT COUNT(*) FROM "public"."poll_votes" v WHERE v.poll_option_id = o.id);
