import type { Tag } from 'oa-shared'

const getAllTags = async () => {
  try {
    const response = await fetch('/api/tags')
    return (await response.json()) as Tag[]
  } catch (error) {
    console.error({ error })
    return []
  }
}

export const tagsService = {
  getAllTags,
}
