import { Heading } from 'theme-ui'

import type { Comment } from 'oa-shared'

export const NO_COMMENTS = 'Start the discussion'
export const ONE_COMMENT = '1 Comment'
export const COMMENTS = 'Comments'

export interface IProps {
  comments: Comment[]
}

export const nonDeletedCommentsCount = (comments: Comment[]) => {
  return comments.filter(({ deleted }) => deleted !== true).length
}

export const DiscussionTitle = ({ comments }: IProps) => {
  const commentCount = nonDeletedCommentsCount(comments)

  const setTitle = () => {
    if (commentCount === 0) {
      return NO_COMMENTS
    }
    if (commentCount === 1) {
      return ONE_COMMENT
    }

    return `${commentCount} ${COMMENTS}`
  }

  const title = setTitle()

  return (
    <Heading as="h3" data-cy="DiscussionTitle">
      {title}
    </Heading>
  )
}
