import { DBMedia, type Project, ProjectDTO, type ProjectFormData } from 'oa-shared';
import { logger } from 'src/logger';
import { createFormData } from 'src/services/formDataHelper';
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
  const data = createFormData<ProjectDTO>({
    title: formData.title,
    description: formData.description,
    category: Number(formData.category?.value) || null,
    coverImage: formData.coverImage ? DBMedia.fromPublicMedia(formData.coverImage) : null,
    difficultyLevel: formData.difficultyLevel,
    fileLink: formData.fileLink,
    files: formData.files,
    tags: formData.tags,
    time: formData.time,
    stepCount: formData.steps.length || 0,
    isDraft: isDraft,
  });

  if (formData.steps?.length) {
    for (let i = 0; i < formData.steps.length; i++) {
      const step = formData.steps[i];
      if (step.id) {
        data.append(`steps.[${i}].id`, step.id.toString());
      }
      data.append(`steps.[${i}].title`, step.title);
      data.append(`steps.[${i}].description`, step.description);

      // Only send existing image metadata (images are uploaded immediately)
      const stepImages = step.images || step.images || [];
      if (stepImages && stepImages.length > 0) {
        for (const image of stepImages) {
          if (image?.path) {
            data.append(`steps.[${i}].images`, JSON.stringify(image));
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
    const errorData = await response.json().catch(() => ({ error: 'Error saving the project' }));
    const errorMessage = errorData.error || errorData.message || 'Error saving the project';
    throw new Error(errorMessage, { cause: response.status });
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
