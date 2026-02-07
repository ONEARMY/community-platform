import type { Question } from 'oa-shared';
import { logger } from 'src/logger';
import type { QuestionSortOption } from './QuestionSortOptions';

export enum QuestionSearchParams {
  category = 'category',
  q = 'q',
  sort = 'sort',
}

const getDraftCount = async () => {
  try {
    const response = await fetch('/api/questions/drafts/count');
    const { total } = (await response.json()) as { total: number };

    return total;
  } catch (error) {
    logger.error('Failed to fetch draft count', { error });
    return 0;
  }
};

const getDrafts = async () => {
  try {
    const response = await fetch('/api/questions/drafts');
    const { items } = (await response.json()) as { items: Question[] };

    return items;
  } catch (error) {
    logger.error('Failed to fetch draft questions', { error });
    return [];
  }
};

const search = async (q: string, category: string, sort: QuestionSortOption, skip: number = 0) => {
  try {
    const url = new URL('/api/questions', window.location.origin);
    url.searchParams.set('q', q);
    url.searchParams.set('category', category);
    url.searchParams.set('sort', sort);
    if (skip > 0) {
      url.searchParams.set('skip', skip.toString());
    }
    const response = await fetch(url);

    const { items, total } = (await response.json()) as {
      items: Question[];
      total: number;
    };
    return { items, total };
  } catch (error) {
    logger.error('Failed to fetch questions', { error });
    return { items: [], total: 0 };
  }
};

export const questionService = {
  getDraftCount,
  getDrafts,
  search,
};
