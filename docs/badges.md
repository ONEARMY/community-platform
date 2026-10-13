# Badges

## Concepts

- **Held badge**: assigned to a profile, by the Stripe webhook or by an admin. Shown next to usernames.
- **Audience badge** (`is_audience`): can restrict news. Only these appear in the news badge picker.
- **Grants** (`grants_badge_id`): holding a badge also counts as holding the badge it grants. Only used for news access, and grants chain.
- **Offer** (`available_to`, `action_label`, `action_url`): which kind of profile can get an audience badge, and the buy button shown to them. Only audience badges can be offered.

## Rules

1. News can only be restricted to audience badges.
2. You can read restricted news if you hold one of its badges, directly or through grants. Admins, editors and moderators can read everything.
3. Otherwise the news is **locked** when a badge offered to your kind of profile unlocks it; anonymous visitors count as `non_space`. Anything else is hidden. Locked rows come only from `get_news_feed_by_content(p_include_locked => true)`, with no content.
4. Your own profile page shows the buy button of the first offered badge you don't hold.
5. Usernames show held badges only.

Example:

| name | is_audience | grants | available_to | action_label |
|---|---|---|---|---|
| member | true | — | non_space | Become a member |
| stripe-tier-1/2/3 | false | member | — | — |
| pro | true | member | space | Go PRO |

## Admin panel

Admins configure badges at `/admin/badges`.

- A name can't change after creation, because code refers to it (e.g. `pro`).
- A badge can't be deleted while it is held, used on news, linked to Stripe, or granted by another badge.
- A badge must stay an audience badge while it is used on news or granted by another badge.
- Badge lists are cached per server for up to an hour, so other servers may show changes late.

## Rollout

1. Apply `20261007100000_badge_audiences`, then deploy. Nothing changes until a tenant is configured.
2. Save the output of the query below, apply `20261007110000_drop_upgrade_badge`, then deploy. It copies each `upgrade_badge` row onto its badge. If a row has an empty label or link, the migration fails; fix the row first.

```sql
SELECT ub.*, pb.name, pb.action_url AS badge_action_url
FROM upgrade_badge ub JOIN profile_badges pb ON pb.id = ub.badge_id
ORDER BY ub.tenant_id, ub.is_space, ub.id;
```

3. Configure each tenant, as below.

## Configuring a tenant with a Member badge

Replace `TENANT`, `IMAGE_URL` and `PRO_URL`. First review:

```sql
SELECT pb.id, pb.name, pb.is_audience, pb.grants_badge_id, pb.available_to, pb.action_label, pb.action_url,
  (SELECT count(*) FROM profile_badges_relations r WHERE r.profile_badge_id = pb.id) AS holders,
  (SELECT count(*) FROM news_badges_relations r WHERE r.profile_badge_id = pb.id) AS articles
FROM profile_badges pb
WHERE pb.tenant_id = 'TENANT'
ORDER BY pb.id;

SELECT n.id, n.slug, array_agg(pb.name ORDER BY pb.name) AS badges
FROM news n
JOIN news_badges_relations nbr ON nbr.news_id = n.id
JOIN profile_badges pb ON pb.id = nbr.profile_badge_id
WHERE n.tenant_id = 'TENANT'
GROUP BY n.id, n.slug
HAVING count(*) FILTER (WHERE pb.name LIKE 'stripe-tier-%') BETWEEN 1 AND 2;
```

The second query lists articles tagged with only some tiers, which will open to every member and to PRO. Every article tagged with a tier also opens to PRO, because PRO grants Member.

Then run this. If the final `SELECT` returns rows, `ROLLBACK` instead of `COMMIT`:

```sql
BEGIN;

INSERT INTO profile_badges (tenant_id, name, display_name, image_url, action_url, is_audience, available_to, action_label)
VALUES ('TENANT', 'member', 'Member', 'IMAGE_URL', '/support', true, 'non_space', 'Become a member');

UPDATE profile_badges
SET grants_badge_id = (SELECT id FROM profile_badges WHERE tenant_id = 'TENANT' AND name = 'member')
WHERE tenant_id = 'TENANT' AND name IN ('stripe-tier-1', 'stripe-tier-2', 'stripe-tier-3', 'pro');

UPDATE profile_badges
SET available_to = 'space',
    action_label = COALESCE(action_label, 'Go PRO'),
    action_url = COALESCE(NULLIF(action_url, ''), 'PRO_URL')
WHERE tenant_id = 'TENANT' AND name = 'pro';

UPDATE profile_badges
SET available_to = NULL, action_label = NULL
WHERE tenant_id = 'TENANT' AND name IN ('stripe-tier-1', 'stripe-tier-2', 'stripe-tier-3');

INSERT INTO news_badges_relations (news_id, profile_badge_id, tenant_id)
SELECT DISTINCT nbr.news_id, pb.grants_badge_id, nbr.tenant_id
FROM news_badges_relations nbr
JOIN profile_badges pb ON pb.id = nbr.profile_badge_id
WHERE pb.tenant_id = 'TENANT'
  AND pb.name IN ('stripe-tier-1', 'stripe-tier-2', 'stripe-tier-3')
  AND NOT EXISTS (
    SELECT 1 FROM news_badges_relations existing
    WHERE existing.news_id = nbr.news_id AND existing.profile_badge_id = pb.grants_badge_id
  );

DELETE FROM news_badges_relations nbr
USING profile_badges pb
WHERE pb.id = nbr.profile_badge_id
  AND pb.tenant_id = 'TENANT'
  AND pb.name IN ('stripe-tier-1', 'stripe-tier-2', 'stripe-tier-3');

UPDATE profile_badges
SET is_audience = false
WHERE tenant_id = 'TENANT' AND name IN ('stripe-tier-1', 'stripe-tier-2', 'stripe-tier-3');

SELECT nbr.news_id, pb.name
FROM news_badges_relations nbr
JOIN profile_badges pb ON pb.id = nbr.profile_badge_id
WHERE pb.tenant_id = 'TENANT' AND NOT pb.is_audience;

COMMIT;
```

Optionally, drop tags made redundant by a grant, for example PRO on an article already tagged Member. Readers don't change, and the card shows only "Member":

```sql
DELETE FROM news_badges_relations nbr
USING profile_badges pb, news_badges_relations other
WHERE pb.id = nbr.profile_badge_id
  AND pb.tenant_id = 'TENANT'
  AND other.news_id = nbr.news_id
  AND other.profile_badge_id = pb.grants_badge_id;
```

Afterwards, non-space profiles see a "Become a member" button on their own profile.
