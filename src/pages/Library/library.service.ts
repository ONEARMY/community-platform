import { logger } from 'src/logger';
import { getCleanFileName } from 'src/utils/storage';

import type { Project, ProjectFormData } from 'oa-shared';
import type { LibrarySortOption } from './Content/List/LibrarySortOptions';

export enum LibrarySearchParams {
  category = 'category',
  q = 'q',
  sort = 'sort',
}

const search = async (q: string, category: string, sort: LibrarySortOption, skip: number = 0) => {
  try {
    const url = new URL('/api/projects', window.location.origin);
    url.searchParams.append('q', q);
    url.searchParams.append('category', category);
    url.searchParams.append('sort', sort);
    url.searchParams.append('skip', skip.toString());

    const response = await fetch(url);
    const { items, total } = (await response.json()) as {
      items: Project[];
      total: number;
    };

    return { items, total };
  } catch (error) {
    logger.error('Failed to fetch projects', { error });
    return { items: [], total: 0 };
  }
};

const getDraftCount = async () => {
  try {
    const response = await fetch('/api/projects/drafts/count');
    const { total } = (await response.json()) as { total: number };

    return total;
  } catch (error) {
    logger.error('Failed to fetch draft count', { error });
    return 0;
  }
};

const getDrafts = async () => {
  try {
    const response = await fetch('/api/projects/drafts');
    const { items } = (await response.json()) as { items: Project[] };

    return items;
  } catch (error) {
    logger.error('Failed to fetch project draft articles', { error });
    return [];
  }
};

const upsert = async (id: number | null, formData: ProjectFormData, isDraft = false) => {
  const data = new FormData();
  data.append('title', formData.title);
  data.append('fileLink', formData.fileLink || '');

  if (formData.time) {
    data.append('time', formData.time);
  }

  if (formData.difficultyLevel) {
    data.append('difficultyLevel', formData.difficultyLevel);
  }

  if (formData.description) {
    data.append('description', formData.description);
  }

  if (formData.tags && formData.tags.length > 0) {
    for (const tag of formData.tags) {
      if (tag) {
        data.append('tags', tag.toString());
      }
    }
  }

  if (formData.category) {
    data.append('category', formData.category?.value.toString());
  }

  if (isDraft) {
    data.append('draft', 'true');
  }

  if (formData.image) {
    data.append('coverImage', formData.image.photoData, getCleanFileName(formData.image.name));
  }

  if (formData.existingImage) {
    data.append('existingCoverImage', formData.existingImage.id);
  }

  if (formData.files && formData.files.length > 0) {
    for (const file of formData.files) {
      if (file) {
        data.append('files', file, getCleanFileName(file.name));
      }
    }
  }

  if (formData.existingFiles && formData.existingFiles.length > 0) {
    for (const file of formData.existingFiles) {
      if (file) {
        data.append('existingFiles', file.id);
      }
    }
  }

  if (formData.steps?.length) {
    data.append('stepCount', formData.steps.length.toString());

    for (let i = 0; i < formData.steps.length; i++) {
      const step = formData.steps[i];
      if (step.id) {
        data.append(`steps.[${i}].id`, step.id.toString());
      }
      data.append(`steps.[${i}].title`, step.title);
      data.append(`steps.[${i}].description`, step.description);

      if (step.images && step.images.length) {
        for (const image of step.images) {
          if (image) {
            data.append(`steps.[${i}].images`, image.photoData, getCleanFileName(image.name));
          }
        }
      }

      if (step.existingImages) {
        for (const image of step.existingImages) {
          if (image) {
            data.append(`steps.[${i}].existingImages`, image.id);
          }
        }
      }
      if (step.videoUrl) {
        data.append(`steps.[${i}].videoUrl`, step.videoUrl);
      }
    }
  }

  const response =
    id === null
      ? await fetch(`/api/projects`, {
          method: 'POST',
          body: data,
        })
      : await fetch(`/api/projects/${id}`, {
          method: 'PUT',
          body: data,
        });

  if (response.status !== 200 && response.status !== 201) {
    if (response.status === 409) {
      throw new Error('Duplicate project', { cause: 409 });
    }

    if (response.statusText) {
      throw new Error(response.statusText, {
        cause: 400,
      });
    }

    throw new Error(response.statusText || 'Error saving the project', {
      cause: 500,
    });
  }

  return (await response.json()) as { project: Project };
};

const deleteProject = async (id: number) => {
  const response = await fetch(`/api/projects/${id}`, {
    method: 'DELETE',
  });

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Error deleting project', { cause: 500 });
  }
};

export const libraryService = {
  search,
  getDrafts,
  getDraftCount,
  upsert,
  deleteProject,
};
