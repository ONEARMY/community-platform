import type { Tag } from 'oa-shared';

import { logger } from 'src/logger';

const getAllTags = async () => {
  try {
    const response = await fetch('/api/tags');
    return (await response.json()) as Tag[];
  } catch (error) {
    logger.error({ error });
    return [];
  }
};

export const tagsService = {
  getAllTags,
};
