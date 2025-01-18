import { auth } from 'src/utils/firebase'

import type { ContentType } from 'src/models/contentType.model'

const add = async (contentType: ContentType, id: number) => {
  return await fetch(`/api/subscribers/${contentType}/${id}`, {
    method: 'POST',
    body: JSON.stringify({}),
    headers: {
      firebaseToken: await auth.currentUser!.getIdToken(),
    },
  })
}

const remove = async (contentType: ContentType, id: number) => {
  return await fetch(`/api/subscribers/${contentType}/${id}`, {
    method: 'DELETE',
    headers: {
      firebaseToken: await auth.currentUser!.getIdToken(),
    },
  })
}

const isSubscribed = async (contentType: ContentType, id: number) => {
  try {
    const response = await fetch(
      `/api/subscribers/${contentType}/${id}/subscribed`,
      {
        headers: {
          firebaseToken: await auth.currentUser!.getIdToken(),
        },
      },
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
