import type { ProfileType } from 'oa-shared';
import { logger } from 'src/logger';

const getProfileTypes = async () => {
  try {
    const response = await fetch('/api/profile-types', {
      cache: 'force-cache',
      headers: {
        'Cache-Control': 'max-age=1800', // 30 minutes
      },
    });

    return ((await response.json()) as ProfileType[]) || [];
  } catch (error) {
    logger.error({ error });
    return [];
  }
};

export const profileTypesService = {
  getProfileTypes,
};
