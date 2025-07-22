import { logger } from 'src/logger'

import type {
  MapPin,
  MapPinFormData,
  Profile,
  ProfileFormData,
} from 'oa-shared'

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
  const url = new URL('/api/profile', window.location.origin)
  const data = new FormData()

  data.append('displayName', value.displayName)
  data.append('about', value.about)
  data.append('country', value.country)
  data.append('type', value.type)
  data.append('isContactable', value.isContactable ? 'true' : 'false')
  data.append('showVisitorPolicy', value.showVisitorPolicy.toString())
  data.append('website', value.website)

  if (value.existingCoverImages && value.existingCoverImages?.length > 0) {
    for (const image of value.existingCoverImages) {
      if (image) {
        data.append('existingCoverImageIds', image.id)
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
    data.append('photo', value.photo, value.photo.name)
  }

  if (value.coverImages?.length) {
    for (let i = 0; i < value.coverImages.length; i++) {
      data.append('coverImages', value.coverImages[i])
    }
  }

  const response = await fetch(url, {
    body: data,
    method: 'POST',
  })

  const result = (await response.json()) as Profile | null

  if (!response.ok || !result) {
    throw new Error(response.statusText || 'Failed to update profile')
  }

  return result
}

const upsertPin = async (pin: MapPinFormData): Promise<MapPin> => {
  const data = new FormData()

  data.append('name', pin.name)
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

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  const { mapPin } = await response.json()

  return mapPin as MapPin
}

const deletePin = async () => {
  const response = await fetch(`/api/settings/map`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  return await response.json()
}

export const profileService = {
  get,
  update,
  upsertPin,
  deletePin,
}
