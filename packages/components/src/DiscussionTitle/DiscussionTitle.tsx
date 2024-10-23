import { Heading } from 'theme-ui'

import type { IComment } from '../CommentItem/types'

export const NO_COMMENTS = 'Start the discussion'
export const ONE_COMMENT = '1 Comment'
export const COMMENTS = 'Comments'

export interface IProps {
  comments: IComment[]
}

export const nonDeletedCommentsCount = (comments: IComment[]) => {
  return comments.filter(({ _deleted }) => _deleted !== true).length
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
