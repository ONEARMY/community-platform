import type { ProfileType } from 'oa-shared'

const getProfileTypes = async () => {
  try {
    const response = await fetch('/api/profile-types')

    return ((await response.json()) as ProfileType[]) || []
  } catch (error) {
    console.error({ error })
    return []
  }
}

export const profileTypesService = {
  getProfileTypes,
}
