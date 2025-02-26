import type { ContentType } from 'src/models/contentType.model'

const add = async (contentType: ContentType, id: number) => {
  return await fetch(`/api/useful/${contentType}/${id}`, {
    method: 'POST',
    body: JSON.stringify({}),
  })
}

const remove = async (contentType: ContentType, id: number) => {
  return await fetch(`/api/useful/${contentType}/${id}`, {
    method: 'DELETE',
  })
}

const hasVoted = async (contentType: ContentType, id: number) => {
  try {
    const response = await fetch(`/api/useful/${contentType}/${id}/voted`)

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
