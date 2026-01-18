set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_subscribed_users_emails_to_notify(p_content_id bigint, p_content_type text, p_notification_content_type text)
 RETURNS TABLE(email character varying, profile_id bigint, profile_created_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN QUERY
    SELECT DISTINCT 
        u.email,
        p.id,
        p.created_at
    FROM subscribers s
    LEFT JOIN notifications_preferences np ON s.user_id = np.user_id
    INNER JOIN profiles p ON s.user_id = p.id
    INNER JOIN auth.users u ON p.auth_id = u.id
    WHERE s.content_id = p_content_id
        AND s.content_type = p_content_type
        AND (
            np.id IS NULL
            OR (
                (np.is_unsubscribed = false OR np.is_unsubscribed IS NULL)
                AND (
                    CASE p_notification_content_type
                        WHEN 'comment' THEN COALESCE(np.comments, true)
                        WHEN 'reply' THEN COALESCE(np.replies, true)
                        WHEN 'researchUpdate' THEN COALESCE(np.research_updates, true)
                        ELSE true
                    END
                )
            )
        );
END;
$function$
;
