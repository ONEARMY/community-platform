import { ProfileTag } from 'oa-shared'

import type { DBProfileTag } from 'oa-shared'

const getAllTags = async () => {
  try {
    const response = await fetch('/api/profile-tags')

    const dbProfileTags = (await response.json()) as DBProfileTag[]
    const profileTags = dbProfileTags.map((tag) => ProfileTag.fromDB(tag))

    return profileTags
  } catch (error) {
    console.error({ error })
    return []
  }
}

export const profileTagsService = {
  getAllTags,
}
