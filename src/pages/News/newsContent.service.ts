import type { Category, News } from 'oa-shared';
import { logger } from 'src/logger';
import type { NewsSortOption } from './NewsSortOptions';

export enum NewsSearchParams {
  category = 'category',
  q = 'q',
  sort = 'sort',
}

const search = async (q: string, sort: NewsSortOption, skip: number = 0) => {
  try {
    const url = new URL('/api/news', window.location.origin);
    url.searchParams.set('q', q);
    url.searchParams.set('sort', sort);
    if (skip > 0) {
      url.searchParams.set('skip', skip.toString());
    }
    const response = await fetch(url);
    const json = (await response.json()) as {
      items: News[];
      total: number;
    };
    const { items, total } = json;
    return { items, total };
  } catch (error) {
    logger.error('Failed to fetch news', { error });
    return { items: [], total: 0 };
  }
};

const getCategories = async () => {
  try {
    const response = await fetch('/api/categories/news');
    const categories = (await response.json()) as Category[];
    return categories;
  } catch (error) {
    logger.error('Failed to fetch news', { error });
    return [];
  }
};

const getDraftCount = async () => {
  try {
    const response = await fetch('/api/news/drafts/count');
    const { total } = (await response.json()) as { total: number };

    return total;
  } catch (error) {
    logger.error('Failed to fetch draft count', { error });
    return 0;
  }
};

const getDrafts = async () => {
  try {
    const response = await fetch('/api/news/drafts');
    const { items } = (await response.json()) as { items: News[] };

    return items;
  } catch (error) {
    logger.error('Failed to fetch draft news', { error });
    return [];
  }
};

export const newsContentService = {
  search,
  getCategories,
  getDraftCount,
  getDrafts,
};
