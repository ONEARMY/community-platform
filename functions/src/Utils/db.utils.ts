export type DiscussionEndpoints = 'howtos' | 'research' | 'questions'

/**
 *  Function used to determine the discussion collection name based on the source type.
 */
export const getDiscussionCollectionName = (
  sourceType: string,
): DiscussionEndpoints | null => {
  switch (sourceType) {
    case 'question':
      return 'questions'
    case 'howto':
      return 'howtos'
    case 'researchUpdate':
      return 'research'
    default:
      return null
  }
}

/**
 *  Function used to generate random ID in same manner as firestore
 */
export const randomID = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let autoId = ''
  for (let i = 0; i < 20; i++) {
    autoId += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return autoId
}
