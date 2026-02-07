import type { UpgradeBadge } from 'oa-shared';
import { logger } from 'src/logger';

const getUpgradeBadges = async () => {
  try {
    const response = await fetch(`/api/upgrade-badges`, {
      cache: 'force-cache',
      headers: {
        'Cache-Control': 'max-age=1800', // 30 minutes
      },
    });
    return (await response.json()) as UpgradeBadge[];
  } catch (error) {
    logger.error('Failed to fetch upgrade badges', { error });
    return [];
  }
};

export const upgradeBadgeService = {
  getUpgradeBadges,
};
