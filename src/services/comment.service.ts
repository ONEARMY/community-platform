const getCommentCount = async (ids: string[]): Promise<Map<string, number>> => {
  const result = await fetch(`/api/comments/count`, {
    method: 'POST',
    body: JSON.stringify({
      ids,
    }),
  })

  return new Map<string, number>(Object.entries(await result.json()))
}

export const commentService = {
  getCommentCount,
}
