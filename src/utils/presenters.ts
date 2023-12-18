export const NO_COMMENTS = 'Start the discussion'
export const ONE_COMMENT = '1 Comment'
export const COMMENTS = 'Comments'

export const setCommentsHeading = (length: number) => {
  if (length === 0) {
    return NO_COMMENTS
  }
  if (length === 1) {
    return ONE_COMMENT
  }

  return `${length} ${COMMENTS}`
}
