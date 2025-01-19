import { auth } from 'src/utils/firebase'

import type { ContentType } from 'src/models/contentType.model'

const add = async (contentType: ContentType, id: number) => {
  return await fetch(`/api/subscribers/${contentType}/${id}`, {
    method: 'POST',
    body: JSON.stringify({}),
  })
}

const remove = async (contentType: ContentType, id: number) => {
  return await fetch(`/api/subscribers/${contentType}/${id}`, {
    method: 'DELETE',
  })
}

const isSubscribed = async (contentType: ContentType, id: number) => {
  try {
    const response = await fetch(
      `/api/subscribers/${contentType}/${id}/subscribed`,
    )

    const { subscribed } = await response.json()

    return !!subscribed
  } catch (error) {
    console.error(error)
    return false
  }
}

export const subscribersService = {
  add,
  remove,
  isSubscribed,
}
