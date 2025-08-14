import { logger } from 'src/logger'

import type { Profile } from 'oa-shared'

const search = async (q: string) => {
  try {
    const url = new URL('/api/profiles', window.location.origin)
    url.searchParams.append('q', q)

    const response = await fetch(url)

    return (await response.json()) as Profile[]
  } catch (error) {
    logger.error('Failed to fetch profiles', { error })
    return []
  }
}

export const profilesService = {
  search,
}
