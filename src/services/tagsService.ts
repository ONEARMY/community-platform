import type { Tag } from 'src/models/tag.model'

const getTags = async () => {
  try {
    const response = await fetch('/api/tags')
    return (await response.json()) as Tag[]
  } catch (error) {
    console.error({ error })
    return []
  }
}
export const tagsService = {
  getTags,
}
