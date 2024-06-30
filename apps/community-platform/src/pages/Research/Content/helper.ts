export const researchCommentUrlPattern = /#update-\d+-comment:/

export const getResearchCommentId = (s: string) =>
  s.replace(researchCommentUrlPattern, '').trim()
