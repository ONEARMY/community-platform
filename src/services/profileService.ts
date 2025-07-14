import { logger } from 'src/logger'

import type { Profile, ProfileFormData } from 'oa-shared'

const get = async () => {
  try {
    const url = new URL('/api/profile', window.location.origin)

    const response = await fetch(url)

    return (await response.json()) as Profile
  } catch (error) {
    logger.error('Failed to fetch research articles', { error })
  }
}

const update = async (value: ProfileFormData) => {
  try {
    const url = new URL('/api/profile', window.location.origin)
    const data = new FormData()
    // TODO

    const response = await fetch(url, {
      body: data,
      method: 'POST',
    })

    return (await response.json()) as Profile
  } catch (error) {
    logger.error('Failed to fetch research articles', { error })
  }
}

export const profileService = {
  get,
  update,
}
