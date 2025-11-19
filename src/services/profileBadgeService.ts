import { logger } from 'src/logger';

import type { ProfileBadge } from 'oa-shared';

const getProfileBadges = async () => {
  try {
    const response = await fetch(`/api/profile-badges`);
    return (await response.json()) as ProfileBadge[];
  } catch (error) {
    logger.error('Failed to fetch profile badges', { error });
    return [];
  }
};

export const ProfileBadgeService = {
  getProfileBadges,
};
