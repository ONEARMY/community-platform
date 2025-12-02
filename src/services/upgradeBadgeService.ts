import { logger } from 'src/logger';

import type { UpgradeBadge } from 'oa-shared';

const getUpgradeBadges = async () => {
  try {
    const response = await fetch(`/api/upgrade-badges`);
    return (await response.json()) as UpgradeBadge[];
  } catch (error) {
    logger.error('Failed to fetch upgrade badges', { error });
    return [];
  }
};

export const UpgradeBadgeService = {
  getUpgradeBadges,
};
