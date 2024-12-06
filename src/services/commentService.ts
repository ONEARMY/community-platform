import { auth } from 'src/utils/firebase'

const getCommentCount = async (ids: string[]): Promise<Map<string, number>> => {
  const result = await fetch(`/api/comments/count`, {
    method: 'POST',
    body: JSON.stringify({
      ids,
    }),
  })

  return new Map<string, number>(Object.entries(await result.json()))
}

const deleteComment = async (sourceId: string | number, id: number) => {
  return await fetch(`/api/discussions/${sourceId}/comments/${id}`, {
    method: 'DELETE',
    headers: {
      firebaseToken: await auth.currentUser!.getIdToken(),
    },
  })
}

const editcomment = async (
  sourceId: string | number,
  id: number,
  comment: string,
) => {
  return await fetch(`/api/discussions/${sourceId}/comments/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      comment,
    }),
    headers: {
      firebaseToken: await auth.currentUser!.getIdToken(),
    },
  })
}

const postComment = async (
  sourceId: string | number,
  comment: string,
  parentId?: number,
) => {
  return await fetch(`/api/discussions/${sourceId}/comments`, {
    method: 'POST',
    body: JSON.stringify({
      comment,
      sourceType: 'questions',
      parentId,
    }),
    headers: {
      firebaseToken: await auth.currentUser!.getIdToken(),
    },
  })
}

export const commentService = {
  getCommentCount,
  postComment,
  editcomment,
  deleteComment,
}
