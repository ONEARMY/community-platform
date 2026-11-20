import type { BadgeAvailability, ProfileBadge } from 'oa-shared';

export const BADGE_AVAILABILITY_OPTIONS: { value: BadgeAvailability; label: string }[] = [
  { value: 'space', label: 'Spaces' },
  { value: 'non_space', label: 'Non-spaces' },
  { value: 'all', label: 'Everyone' },
];

const BADGE_NAME_PATTERN = /^[a-z0-9-]+$/;

export interface ProfileBadgeUsage {
  holders: number;
  articles: number;
  stripeLinked: boolean;
}

export interface AdminProfileBadge {
  badge: ProfileBadge;
  usage: ProfileBadgeUsage;
}

export interface ProfileBadgeInput {
  name: string;
  displayName: string;
  imageUrl: string;
  actionUrl: string | null;
  isAudience: boolean;
  grantsBadgeId: number | null;
  availableTo: BadgeAvailability | null;
  actionLabel: string | null;
}

export interface ProfileBadgeError {
  message: string;
  field: keyof ProfileBadgeInput;
  conflict?: boolean;
}

export const grantsClosure = (ids: number[], badges: ProfileBadge[]) => {
  const badgesById = new Map(badges.map((badge) => [badge.id, badge]));
  const held = new Set<number>();
  const pending = [...ids];

  while (pending.length) {
    const id = pending.pop() as number;

    if (held.has(id)) {
      continue;
    }

    held.add(id);

    const grantedId = badgesById.get(id)?.grantsBadgeId;

    if (grantedId) {
      pending.push(grantedId);
    }
  }

  return held;
};

export const canGrant = (badges: ProfileBadge[], badgeId: number | undefined, targetId: number) => {
  const target = badges.find((badge) => badge.id === targetId);

  if (!target?.isAudience || targetId === badgeId) {
    return false;
  }

  return badgeId === undefined || !grantsClosure([targetId], badges).has(badgeId);
};

const trimmed = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

export const normalizeProfileBadgeInput = (
  value: Partial<Record<keyof ProfileBadgeInput, unknown>>,
): ProfileBadgeInput => {
  const isAudience = value.isAudience === true;
  const availableTo = isAudience ? (trimmed(value.availableTo) as BadgeAvailability) || null : null;

  return {
    name: trimmed(value.name),
    displayName: trimmed(value.displayName),
    imageUrl: trimmed(value.imageUrl),
    actionUrl: trimmed(value.actionUrl) || null,
    isAudience,
    grantsBadgeId: Number(value.grantsBadgeId) || null,
    availableTo,
    actionLabel: availableTo ? trimmed(value.actionLabel) || null : null,
  };
};

export const getProfileBadgeErrors = (
  input: ProfileBadgeInput,
  badges: AdminProfileBadge[],
  id?: number,
): ProfileBadgeError[] => {
  const allBadges = badges.map(({ badge }) => badge);
  const errors: ProfileBadgeError[] = [];

  if (id === undefined) {
    if (!BADGE_NAME_PATTERN.test(input.name)) {
      errors.push({ message: 'Use lowercase letters, numbers and dashes only', field: 'name' });
    } else if (allBadges.some((badge) => badge.name === input.name)) {
      errors.push({ message: 'This name is already taken', field: 'name', conflict: true });
    }
  }

  if (!input.displayName) {
    errors.push({ message: 'Display name is required', field: 'displayName' });
  }

  if (!input.imageUrl) {
    errors.push({ message: 'Image is required', field: 'imageUrl' });
  }

  if (input.grantsBadgeId && !canGrant(allBadges, id, input.grantsBadgeId)) {
    errors.push({
      message: 'Can only grant an audience badge that does not already grant this one',
      field: 'grantsBadgeId',
    });
  }

  if (
    input.availableTo &&
    !BADGE_AVAILABILITY_OPTIONS.some((option) => option.value === input.availableTo)
  ) {
    errors.push({ message: 'Choose who this badge is offered to', field: 'availableTo' });
  }

  if (input.availableTo && !input.actionLabel) {
    errors.push({
      message: 'A button label is required when the badge is offered',
      field: 'actionLabel',
    });
  }

  if (input.availableTo && !input.actionUrl) {
    errors.push({ message: 'A link is required when the badge is offered', field: 'actionUrl' });
  }

  const current = badges.find(({ badge }) => badge.id === id);
  const lockReason =
    current?.badge.isAudience && !input.isAudience ? getAudienceLockReason(current, allBadges) : '';

  if (lockReason) {
    errors.push({ message: `It must stay an audience badge: ${lockReason}`, field: 'isAudience' });
  }

  return errors;
};

export const getProfileBadgeError = (
  input: ProfileBadgeInput,
  badges: AdminProfileBadge[],
  id?: number,
): ProfileBadgeError | null => getProfileBadgeErrors(input, badges, id)[0] ?? null;

export const getAudienceLockReason = (
  { badge, usage }: AdminProfileBadge,
  badges: ProfileBadge[],
) => {
  const reasons = [
    usage.articles && `used on ${usage.articles} news articles`,
    badges.some((other) => other.grantsBadgeId === badge.id) && 'granted by another badge',
  ].filter(Boolean);

  return reasons.join(', ');
};

export const getProfileBadgeDeleteError = (id: number, badges: AdminProfileBadge[]) => {
  const current = badges.find(({ badge }) => badge.id === id);

  if (!current) {
    return null;
  }

  const grantedBy = badges
    .filter(({ badge }) => badge.grantsBadgeId === id)
    .map(({ badge }) => badge.displayName);

  const reasons = [
    current.usage.holders && `held by ${current.usage.holders} profiles`,
    current.usage.articles && `used on ${current.usage.articles} news articles`,
    current.usage.stripeLinked && 'linked to Stripe',
    grantedBy.length && `granted by ${grantedBy.join(', ')}`,
  ].filter(Boolean);

  return reasons.length ? `This badge can't be deleted: ${reasons.join(', ')}` : null;
};
