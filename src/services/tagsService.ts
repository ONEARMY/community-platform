import type { Tag } from 'oa-shared';
import { logger } from 'src/logger';

export interface TagFormData {
  name: string;
}

const getAllTags = async () => {
  try {
    const response = await fetch('/api/tags');
    return (await response.json()) as Tag[];
  } catch (error) {
    logger.error({ error });
    return [];
  }
};

const createTag = async (form: TagFormData) => {
  const response = await fetch('/api/admin/tags', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Error creating tag' }));
    throw new Error(errorData.error || 'Error creating tag');
  }

  return (await response.json()) as Tag;
};

const updateTag = async (id: number, form: TagFormData) => {
  const response = await fetch(`/api/admin/tags/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Error updating tag' }));
    throw new Error(errorData.error || 'Error updating tag');
  }

  return (await response.json()) as Tag;
};

export const tagsService = {
  getAllTags,
  createTag,
  updateTag,
};
