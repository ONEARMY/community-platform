import { auth } from 'src/utils/firebase'

import type { ContentType } from 'src/models/contentType.model'

const add = async (contentType: ContentType, id: number) => {
  return await fetch(`/api/useful/${contentType}/${id}`, {
    method: 'POST',
    body: JSON.stringify({}),
    headers: {
      firebaseToken: await auth.currentUser!.getIdToken(),
    },
  })
}

const remove = async (contentType: ContentType, id: number) => {
  return await fetch(`/api/useful/${contentType}/${id}`, {
    method: 'DELETE',
    headers: {
      firebaseToken: await auth.currentUser!.getIdToken(),
    },
  })
}

const hasVoted = async (contentType: ContentType, id: number) => {
  try {
    const response = await fetch(`/api/useful/${contentType}/${id}/voted`, {
      headers: {
        firebaseToken: await auth.currentUser!.getIdToken(),
      },
    })

    const { voted } = await response.json()

    return !!voted
  } catch (error) {
    console.error(error)
    return false
  }
}

export const usefulService = {
  add,
  remove,
  hasVoted,
}
