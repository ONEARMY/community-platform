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

export const commentService = {
  postComment,
  editcomment,
  deleteComment,
}
