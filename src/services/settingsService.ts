import type { MapPin, ProfileFormData } from 'oa-shared'

const update = async (profile: ProfileFormData) => {
  const data = new FormData()

  data.append('displayName', profile.displayName)
  data.append('country', profile.country)
  data.append('about', profile.about ?? '')
  data.append('type', profile.type)
  data.append('isContactable', profile.isContactable ? 'true' : 'false')
  data.append('showVisitorPolicy', profile.showVisitorPolicy ? 'true' : 'false')
  data.append('visitorStatus', profile.visitorPolicy.policy || '')
  data.append('visitorPolicy', profile.visitorPolicy.details || '')

  if (profile.links && profile.links.length > 0) {
    for (let i = 0; i < profile.links.length; i++) {
      data.append(`links[${i}].label`, profile.links[i].label)
      data.append(`links[${i}].url`, profile.links[i].url)
    }
  }

  if (profile.tagIds && profile.tagIds.length > 0) {
    for (const tag of profile.tagIds) {
      data.append('tags', tag.toString())
    }
  }

  if (profile.image && profile.image) {
    data.append('image', profile.image.photoData, profile.image.name)
  }

  if (profile.coverImages && profile.coverImages.length > 0) {
    for (const image of profile.coverImages) {
      data.append('coverImages', image.photoData, image.name)
    }
  }

  if (profile.existingImageId) {
    data.append('existingImageId', profile.existingImageId)
  }

  if (
    profile.existingCoverImageIds &&
    profile.existingCoverImageIds.length > 0
  ) {
    for (const id of profile.existingCoverImageIds) {
      data.append('existingCoverImageIds', id)
    }
  }

  const response = await fetch(`/api/settings/map`, {
    method: 'POST',
    body: data,
  })

  return await response.json()
}

const upsertPin = async (
  pin: Omit<
    MapPin,
    'id' | 'userId' | 'profile' | 'moderation' | 'moderation_feedback'
  >,
) => {
  const data = new FormData()

  data.append('name', pin.name)
  data.append('country', pin.country)
  data.append('countryCode', pin.countryCode)
  data.append('administrative', pin.administrative)
  data.append('postcode', pin.postcode)
  data.append('description', pin.description)
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

export const settingsService = {
  update,
  upsertPin,
  deletePin,
}
