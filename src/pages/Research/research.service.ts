import {
  DBMedia,
  ResearchDTO,
  type ResearchFormData,
  type ResearchItem,
  type ResearchStatus,
  type ResearchUpdate,
  type ResearchUpdateDTO,
  type ResearchUpdateFormData,
} from 'oa-shared';
import { logger } from 'src/logger';
import { createFormData } from 'src/services/formDataHelper';
import type { ResearchSortOption } from './ResearchSortOptions';

const search = async (
  q: string,
  category: string,
  sort: ResearchSortOption,
  status: ResearchStatus | null,
  skip: number = 0,
) => {
  try {
    const url = new URL('/api/research', window.location.origin);
    url.searchParams.append('q', q);
    url.searchParams.append('category', category);
    url.searchParams.append('sort', sort);
    url.searchParams.append('status', status ?? '');
    url.searchParams.append('skip', skip.toString());

    const response = await fetch(url);
    const { items, total } = (await response.json()) as {
      items: ResearchItem[];
      total: number;
    };

    return { items, total };
  } catch (error) {
    logger.error('Failed to fetch research articles', { error });
    return { items: [], total: 0 };
  }
};

const getDraftCount = async () => {
  try {
    const response = await fetch('/api/research/drafts/count');
    const { total } = (await response.json()) as { total: number };

    return total;
  } catch (error) {
    logger.error('Failed to fetch draft count', { error });
    return 0;
  }
};

const getDrafts = async () => {
  try {
    const response = await fetch('/api/research/drafts');
    const { items } = (await response.json()) as { items: ResearchItem[] };

    return items;
  } catch (error) {
    logger.error('Failed to fetch research draft articles', { error });
    return [];
  }
};

const upsert = async (id: number | null, research: ResearchFormData, isDraft = false) => {
  const data = createFormData<ResearchDTO>({
    title: research.title,
    description: research.description,
    category: Number(research.category?.value) || null,
    collaborators: research.collaborators,
    image: research.image ? DBMedia.fromPublicMedia(research.image) : null,
    tags: research.tags,
    isDraft,
  });

  const response =
    id === null
      ? await fetch(`/api/research`, {
          method: 'POST',
          body: data,
        })
      : await fetch(`/api/research/${id}`, {
          method: 'PUT',
          body: data,
        });

  if (response.status !== 200 && response.status !== 201) {
    // Try to parse error from response body
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error || 'Error saving research';

    throw new Error(errorMessage, { cause: response.status });
  }

  return (await response.json()) as { research: ResearchItem };
};

const upsertUpdate = async (
  researchId: number,
  updateId: number | null,
  update: ResearchUpdateFormData,
  isDraft = false,
) => {
  const data = createFormData<ResearchUpdateDTO>({
    title: update.title,
    description: update.description,
    fileLink: update.fileLink,
    files: update.files,
    images: update.images?.length ? update.images.map(DBMedia.fromPublicMedia) : null,
    videoUrl: update.videoUrl,
    isDraft,
  });

  const response =
    updateId === null
      ? await fetch(`/api/research/${researchId}/updates`, {
          method: 'POST',
          body: data,
        })
      : await fetch(`/api/research/${researchId}/updates/${updateId}`, {
          method: 'PUT',
          body: data,
        });

  if (response.status !== 200 && response.status !== 201) {
    if (response.status === 409) {
      throw new Error('Duplicate research update', { cause: 409 });
    }

    throw new Error('Error saving research update', { cause: 500 });
  }

  return (await response.json()) as { researchUpdate: ResearchUpdate };
};

const deleteResearch = async (id: number) => {
  const response = await fetch(`/api/research/${id}`, {
    method: 'DELETE',
  });

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Error deleting research', { cause: 500 });
  }
};

const updateResearchStatus = async (id: number, status: ResearchStatus) => {
  const data = new FormData();
  data.append('status', status);

  const response = await fetch(`/api/research/${id}/status`, {
    method: 'PATCH',
    body: data,
  });

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Error updating research status', { cause: 500 });
  }
};

const deleteUpdate = async (id: number, updateId: number | null) => {
  const response = await fetch(`/api/research/${id}/updates/${updateId}`, {
    method: 'DELETE',
  });

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Error deleting research update', { cause: 500 });
  }
};

export const researchService = {
  search,
  getDrafts,
  getDraftCount,
  upsert,
  upsertUpdate,
  updateResearchStatus,
  deleteResearch,
  deleteUpdate,
};
