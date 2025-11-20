import { logger } from 'src/logger';

import type { Category, ContentType } from 'oa-shared';

const getCategories = async (type: ContentType) => {
  try {
    const response = await fetch(`/api/categories/${type}`);
    return (await response.json()) as Category[];
  } catch (error) {
    logger.error('Failed to fetch categories', { error });
    return [];
  }
};

export const categoryService = {
  getCategories,
};
