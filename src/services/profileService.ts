import { logger } from 'src/logger'

import type { MapPinFormData, Profile, ProfileFormData } from 'oa-shared'

const get = async () => {
  try {
    const url = new URL('/api/profile', window.location.origin)

    const response = await fetch(url)

    return (await response.json()) as Profile
  } catch (error) {
    logger.error('Failed to fetch research articles', { error })
  }
}

const update = async (
  value: ProfileFormData,
  photo?: File,
  coverImages?: File[],
) => {
  const url = new URL('/api/profile', window.location.origin)
  const data = new FormData()

  data.append('displayName', value.displayName)
  data.append('about', value.about)
  data.append('country', value.country)
  data.append('type', value.type)
  data.append('isContactable', value.isContactable ? 'true' : 'false')
  data.append('showVisitorPolicy', value.showVisitorPolicy.toString())
  data.append('website', value.website)

  if (value.existingCoverImageIds && value.existingCoverImageIds?.length > 0) {
    for (const image of value.existingCoverImageIds) {
      if (image) {
        data.append('existingCoverImageIds', image)
      }
    }
  }

  if (value.showVisitorPolicy) {
    if (value.visitorPreferenceDetails) {
      data.append('visitorPreferenceDetails', value.visitorPreferenceDetails)
    }
    if (value.visitorPreferencePolicy) {
      data.append('visitorPreferencePolicy', value.visitorPreferencePolicy)
    }
  }

  if (value.tagIds && value.tagIds?.length > 0) {
    for (const tagId of value.tagIds) {
      if (tagId) {
        data.append('tagIds', tagId.toString())
      }
    }
  }

  if (value.photo) {
    data.append('photo', value.photo.photoData, value.photo.name)
  }

  if (coverImages?.length) {
    for (let i = 0; i < coverImages.length; i++) {
      data.append('coverImages', coverImages[i])
    }
  }

  const response = await fetch(url, {
    body: data,
    method: 'POST',
  })

  const result = (await response.json()) as Profile | null

  if (!response.ok || !result) {
    throw new Error('Failed to update profile')
  }

  return result
}

const upsertPin = async (pin: MapPinFormData) => {
  const data = new FormData()

  data.append('country', pin.country)
  data.append('countryCode', pin.countryCode)
  data.append('administrative', pin.administrative || '')
  data.append('postCode', pin.postCode || '')
  data.append('lat', pin.lat.toString())
  data.append('lng', pin.lng.toString())

  const response = await fetch(`/api/settings/map`, {
    method: 'POST',
    body: data,
  })

  return await response.json()
}

const deletePin = async () => {
  const response = await fetch(`/api/settings/map`, {
    method: 'DELETE',
  })

  return await response.json()
}

export const profileService = {
  get,
  update,
  upsertPin,
  deletePin,
}
