import type { ProfileTag } from 'oa-shared';
import { logger } from 'src/logger';

const getAllTags = async () => {
  try {
    const response = await fetch('/api/profile-tags');

    const profileTags = (await response.json()) as ProfileTag[];

    return profileTags;
  } catch (error) {
    logger.error({ error });
    return [];
  }
};

export const profileTagsService = {
  getAllTags,
};
