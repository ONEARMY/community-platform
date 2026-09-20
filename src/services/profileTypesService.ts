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

const deleteProfileType = async (id: number) => {
  const response = await fetch(`/api/profile-types/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Error deleting profile type' }));
    throw new Error(errorData.error || 'Error deleting profile type');
  }
};
export const profileTypesService = {
  deleteProfileType,
  getProfileTypes,
};
