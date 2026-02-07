import type { ProfileBadge } from 'oa-shared';
import { logger } from 'src/logger';

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
