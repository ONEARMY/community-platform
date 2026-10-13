update "public"."profile_badges" pb
set available_to = ub.available_to,
    action_label = ub.action_label,
    action_url = coalesce(nullif(pb.action_url, ''), ub.action_url)
from (
  select
    badge_id,
    case when bool_and(is_space) then 'space' when bool_or(is_space) then 'all' else 'non_space' end as available_to,
    (array_agg(action_label order by id))[1] as action_label,
    (array_agg(action_url order by id))[1] as action_url
  from "public"."upgrade_badge"
  group by badge_id
) ub
where pb.id = ub.badge_id;

drop table "public"."upgrade_badge";
