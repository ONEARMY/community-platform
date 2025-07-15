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

    data.append('displayName', value.displayName)
    data.append('about', value.about)
    data.append('country', value.country)
    data.append('type', value.type)
    data.append('existingImageId', value.existingImageId || '')
    data.append('isContactable', value.isContactable ? 'true' : 'false')
    data.append('showVisitorPolicy', value.showVisitorPolicy.toString())

    if (
      value.existingCoverImageIds &&
      value.existingCoverImageIds?.length > 0
    ) {
      for (const image of value.existingCoverImageIds) {
        if (image) {
          data.append('existingCoverImageIds', image)
        }
      }
    }

    if (value.links && value.links?.length > 0) {
      data.append('linkCount', value.links.length.toString())

      for (let i = 0; i < value.links.length; i++) {
        const link = value.links[0]
        if (link) {
          data.append(`links.[${i}].label`, link.label)
          data.append(`links.[${i}].url`, link.url)
        }
      }
    }

    if (value.showVisitorPolicy) {
      if (value.visitorPolicy?.details) {
        data.append('visitorPolicyDetails', value.visitorPolicy.details)
      }
      if (value.visitorPolicy?.policy) {
        data.append('visitorPolicy', value.visitorPolicy.policy)
      }
    }

    if (value.tagIds && value.tagIds?.length > 0) {
      for (const tagId of value.tagIds) {
        if (tagId) {
          data.append('tags', tagId.toString())
        }
      }
    }

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
