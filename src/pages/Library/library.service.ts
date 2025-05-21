import { logger } from 'src/logger'

import type { Project, ProjectFormData } from 'oa-shared'
import type { LibrarySortOption } from './Content/List/LibrarySortOptions'

export enum LibrarySearchParams {
  category = 'category',
  q = 'q',
  sort = 'sort',
}

const search = async (
  q: string,
  category: string,
  sort: LibrarySortOption,
  skip: number = 0,
) => {
  try {
    const url = new URL('/api/projects', window.location.origin)
    url.searchParams.append('q', q)
    url.searchParams.append('category', category)
    url.searchParams.append('sort', sort)
    url.searchParams.append('skip', skip.toString())

    const response = await fetch(url)
    const { items, total } = (await response.json()) as {
      items: Project[]
      total: number
    }

    return { items, total }
  } catch (error) {
    logger.error('Failed to fetch projects', { error })
    return { items: [], total: 0 }
  }
}

const getDraftCount = async () => {
  try {
    const response = await fetch('/api/projects/drafts/count')
    const { total } = (await response.json()) as { total: number }

    return total
  } catch (error) {
    logger.error('Failed to fetch draft count', { error })
    return 0
  }
}

const getDrafts = async () => {
  try {
    const response = await fetch('/api/projects/drafts')
    const { items } = (await response.json()) as { items: Project[] }

    return items
  } catch (error) {
    logger.error('Failed to fetch project draft articles', { error })
    return []
  }
}

const upsert = async (
  id: number | null,
  project: ProjectFormData,
  isDraft = false,
) => {
  const data = new FormData()
  data.append('title', project.title)
  data.append('fileLink', project.fileLink || '')

  if (project.description) {
    data.append('description', project.description)
  }

  if (project.tags && project.tags.length > 0) {
    for (const tag of project.tags) {
      data.append('tags', tag.toString())
    }
  }

  if (project.category) {
    data.append('category', project.category?.value.toString())
  }

  if (isDraft) {
    data.append('draft', 'true')
  }

  if (project.coverImage) {
    data.append('image', project.coverImage.photoData, project.coverImage.name)
  }

  if (project.existingCoverImage) {
    data.append('existingImage', project.existingCoverImage.id)
  }

  if (project.files && project.files.length > 0) {
    for (const file of project.files) {
      data.append('files', file, file.name)
    }
  }

  if (project.existingFiles && project.existingFiles.length > 0) {
    for (const file of project.existingFiles) {
      data.append('existingFiles', file.id)
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
        })

  if (response.status !== 200 && response.status !== 201) {
    if (response.status === 409) {
      throw new Error('Duplicate project', { cause: 409 })
    }

    throw new Error('Error saving project', { cause: 500 })
  }

  return (await response.json()) as { project: Project }
}

const deleteProject = async (id: number) => {
  const response = await fetch(`/api/projects/${id}`, {
    method: 'DELETE',
  })

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Error deleting project', { cause: 500 })
  }
}

export const libraryService = {
  search,
  getDrafts,
  getDraftCount,
  upsert,
  deleteProject,
}
