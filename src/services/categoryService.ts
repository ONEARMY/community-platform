import type { Category, ContentType } from 'oa-shared';
import { logger } from 'src/logger';

const getCategories = async (type: ContentType) => {
  try {
    const response = await fetch(`/api/categories/${type}`);
    return (await response.json()) as Category[];
  } catch (error) {
    logger.error('Failed to fetch categories', { error });
    return [];
  }
};

export interface CategoryFormData {
  name: string;
  type: ContentType;
  description: string | null;
  imageUrl: string | null;
}

const createCategory = async (form: CategoryFormData) => {
  const response = await fetch('/api/admin/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Error creating category' }));
    throw new Error(errorData.error || 'Error creating category');
  }

  return (await response.json()) as Category;
};

const updateCategory = async (id: number, form: CategoryFormData) => {
  const response = await fetch(`/api/admin/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Error updating category' }));
    throw new Error(errorData.error || 'Error updating category');
  }

  return (await response.json()) as Category;
};

const deleteCategory = async (id: number) => {
  const response = await fetch(`/api/admin/categories/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Error deleting category' }));
    throw new Error(errorData.error || 'Error deleting category');
  }
};

export const categoryService = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
