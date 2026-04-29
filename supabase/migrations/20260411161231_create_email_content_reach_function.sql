set check_function_bodies = off;

create or replace function public.get_profiles_by_badge(p_badge_id bigint)
returns table (
  profile_id bigint,
  badges jsonb,
  notification_preferences jsonb,
  email text
)
language sql
stable
security definer
set search_path = public, auth
as $$
  select
    p.id as profile_id,
    coalesce(
      jsonb_agg(
        distinct jsonb_build_object(
          'id', pb.id,
          'name', pb.name,
          'display_name', pb.display_name
        )
      ) filter (where pb.id is not null),
      '[]'::jsonb
    ) as badges,
    jsonb_build_object(
      'comments', np.comments,
      'replies', np.replies,
      'research_updates', np.research_updates,
      'is_unsubscribed', np.is_unsubscribed,
      'email_content_reach', case
        when ecr.id is null then null
        else jsonb_build_object(
          'id', ecr.id,
          'name', ecr.name,
          'preferences_label', ecr.preferences_label,
          'create_content_label', ecr.create_content_label,
          'default_option', ecr.default_option,
          'tenant_id', ecr.tenant_id,
          'created_at', ecr.created_at
        )
      end
    ) as notification_preferences,
    u.email::text as email
  from public.profiles p
  left join public.profile_badges_relations pbr_all
    on pbr_all.profile_id = p.id
  left join public.profile_badges pb
    on pb.id = pbr_all.profile_badge_id
  left join public.notifications_preferences np
    on np.user_id = p.id
  left join public.email_content_reach ecr
    on ecr.id = np.email_content_reach
  left join auth.users u
    on u.id = p.auth_id
  where exists (
    select 1
    from public.profile_badges_relations pbr_filter
    where pbr_filter.profile_id = p.id
      and pbr_filter.profile_badge_id = p_badge_id
  )
  group by
    p.id,
    np.comments,
    np.replies,
    np.research_updates,
    np.is_unsubscribed,
    ecr.id,
    ecr.name,
    ecr.preferences_label,
    ecr.create_content_label,
    ecr.default_option,
    ecr.tenant_id,
    ecr.created_at,
    u.email;
$$;

revoke all on function public.get_profiles_by_badge(bigint) from public;
grant execute on function public.get_profiles_by_badge(bigint) to authenticated;

