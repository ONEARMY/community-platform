import { logger } from 'src/logger'

import type {
  ResearchFormData,
  ResearchItem,
  ResearchStatus,
  ResearchUpdateFormData,
} from 'oa-shared'
import type { ResearchSortOption } from './ResearchSortOptions'

const search = async (
  q: string,
  category: string,
  sort: ResearchSortOption,
  status: ResearchStatus | null,
  skip: number = 0,
) => {
  try {
    const url = new URL('/api/research', window.location.origin)
    url.searchParams.append('q', q)
    url.searchParams.append('category', category)
    url.searchParams.append('sort', sort)
    url.searchParams.append('status', status ?? '')
    url.searchParams.append('skip', skip.toString())

    const response = await fetch(url)
    const { items, total } = (await response.json()) as {
      items: ResearchItem[]
      total: number
    }

    return { items, total }
  } catch (error) {
    logger.error('Failed to fetch research articles', { error })
    return { items: [], total: 0 }
  }
}

const getDraftCount = async () => {
  try {
    const response = await fetch('/api/research/drafts/count')
    const { total } = (await response.json()) as { total: number }

    return total
  } catch (error) {
    logger.error('Failed to fetch draft count', { error })
    return 0
  }
}

const getDrafts = async () => {
  try {
    const response = await fetch('/api/research/drafts')
    const { items } = (await response.json()) as { items: ResearchItem[] }

    return items
  } catch (error) {
    logger.error('Failed to fetch research draft articles', { error })
    return []
  }
}

const upsert = async (
  id: number | null,
  research: ResearchFormData,
  isDraft = false,
) => {
  const data = new FormData()
  data.append('title', research.title)

  if (research.description) {
    data.append('description', research.description)
  }

  if (research.tags && research.tags.length > 0) {
    for (const tag of research.tags) {
      data.append('tags', tag.toString())
    }
  }

  if (research.category) {
    data.append('category', research.category?.value.toString())
  }

  if (research.collaborators) {
    for (const collaborator of research.collaborators) {
      data.append('collaborators', collaborator.toString())
    }
  }

  if (isDraft) {
    data.append('draft', 'true')
  }

  if (research.image) {
    data.append('image', research.image.photoData, research.image.name)
  }

  if (research.existingImage) {
    data.append('existingImage', research.existingImage.id)
  }

  const response =
    id === null
      ? await fetch(`/api/research`, {
          method: 'POST',
          body: data,
        })
      : await fetch(`/api/research/${id}`, {
          method: 'PUT',
          body: data,
        })

  if (response.status !== 200 && response.status !== 201) {
    if (response.status === 409) {
      throw new Error('Duplicate research item', { cause: 409 })
    }

    throw new Error('Error saving research', { cause: 500 })
  }

  return (await response.json()) as { research: ResearchItem }
}

const upsertUpdate = async (
  id: number,
  updateId: number | null,
  update: ResearchUpdateFormData,
  isDraft = false,
) => {
  const data = new FormData()
  data.append('title', update.title)
  data.append('description', update.description)
  data.append('fileLink', update.fileLink || '')
  data.append('videoUrl', update.videoUrl || '')

  if (update.images && update.images.length > 0) {
    for (const image of update.images) {
      data.append('images', image, image.name)
    }
  }

  if (update.existingImages && update.existingImages.length > 0) {
    for (const image of update.existingImages) {
      data.append('existingImages', image.id)
    }
  }

  if (update.files && update.files.length > 0) {
    for (const file of update.files) {
      data.append('files', file, file.name)
    }
  }

  if (update.existingFiles && update.existingFiles.length > 0) {
    for (const file of update.existingFiles) {
      data.append('existingFiles', file.id)
    }
  }

  if (isDraft) {
    data.append('draft', 'true')
  }

  const response =
    updateId === null
      ? await fetch(`/api/research/${id}/updates`, {
          method: 'POST',
          body: data,
        })
      : await fetch(`/api/research/${id}/updates/${updateId}`, {
          method: 'PUT',
          body: data,
        })

  if (response.status !== 200 && response.status !== 201) {
    if (response.status === 409) {
      throw new Error('Duplicate research update', { cause: 409 })
    }

    throw new Error('Error saving research update', { cause: 500 })
  }

  return (await response.json()) as { researchUpdate: ResearchItem }
}

const deleteResearch = async (id: number) => {
  const response = await fetch(`/api/research/${id}`, {
    method: 'DELETE',
  })

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Error deleting research', { cause: 500 })
  }
}

const deleteUpdate = async (id: number, updateId: number | null) => {
  const response = await fetch(`/api/research/${id}/updates/${updateId}`, {
    method: 'DELETE',
  })

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Error deleting research update', { cause: 500 })
  }
}

export const researchService = {
  search,
  getDrafts,
  getDraftCount,
  upsert,
  upsertUpdate,
  deleteResearch,
  deleteUpdate,
}
