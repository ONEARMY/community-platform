import { logger } from 'src/logger'
import { DBResearchItem, ResearchItem } from 'src/models/research.model'

import type { ResearchStatus } from 'oa-shared'
import type {
  ResearchFormData,
  ResearchUpdateFormData,
} from 'src/models/research.model'
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

const getDraftCount = async (userId: string) => {
  try {
    const response = await fetch(`/api/research/drafts/count?userId=${userId}`)
    const { total } = (await response.json()) as { total: number }

    return total
  } catch (error) {
    logger.error('Failed to fetch draft count', { error })
    return 0
  }
}

const getDrafts = async (userId: string) => {
  try {
    const response = await fetch(`/api/research?drafts=true&userId=${userId}`)
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
  data.append('description', research.description)

  if (research.tags && research.tags.length > 0) {
    for (const tag of research.tags) {
      data.append('tags', tag.toString())
    }
  }

  if (research.category) {
    data.append('category', research.category?.value.toString())
  }

  if (research.collaborators) {
    data.append('collaborators', research.collaborators.join(','))
  }

  if (isDraft) {
    data.append('draft', 'true')
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

  const result = await response.json()

  return ResearchItem.fromDB(new DBResearchItem(result.research), [])
}

const upsertUpdate = async (
  id: number,
  updateId: number | null,
  update: ResearchUpdateFormData,
) => {
  const data = new FormData()
  data.append('title', update.title)
  data.append('description', update.description)

  if (update.images && update.images.length > 0) {
    for (const image of update.images) {
      data.append('images', image.photoData, image.name)
    }
  }

  if (update.existingImages && update.existingImages.length > 0) {
    for (const image of update.existingImages) {
      data.append('existingImages', image.id)
    }
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

  const result = await response.json()

  return ResearchItem.fromDB(new DBResearchItem(result.research), [])
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
