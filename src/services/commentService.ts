import type { Comment } from 'oa-shared'

const deleteComment = async (sourceId: string | number, id: number) => {
  return await fetch(`/api/discussions/${sourceId}/comments/${id}`, {
    method: 'DELETE',
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
  })
}

const getComments = async (sourceId: string | number) => {
  const result = await fetch(`/api/discussions/${sourceId}/comments`)
  const { comments } = (await result.json()) as { comments: Comment[] }
  return comments
}

const getCommentSourceId = async (commentId: number) => {
  const result = await fetch(`/api/comments/${commentId}/source`)
  const { sourceId } = (await result.json()) as { sourceId: number }

  return sourceId
}

export const commentService = {
  getComments,
  getCommentSourceId,
  postComment,
  editcomment,
  deleteComment,
}
