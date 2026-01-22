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