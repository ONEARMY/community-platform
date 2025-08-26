import { Button } from '../Button/Button'
import { nonDeletedCommentsCount } from '../DiscussionTitle/DiscussionTitle'

import type { Comment } from 'oa-shared'

export interface Props {
  isShowReplies: boolean
  replies: Comment[]
  setIsShowReplies: () => void
}

export const ButtonShowReplies = (props: Props) => {
  const { isShowReplies, replies, setIsShowReplies } = props

  const count = nonDeletedCommentsCount(replies)
  const icon = isShowReplies ? 'chevron-up' : 'chevron-down'

  const text = count
    ? isShowReplies
      ? `Hide ${count} ${count === 1 ? 'reply' : 'replies'}`
      : `Show ${count} ${count === 1 ? 'reply' : 'replies'}`
    : isShowReplies
      ? `Hide`
      : `Reply`

  return (
    <Button
      type="button"
      data-cy="show-replies"
      data-testid="show-replies"
      icon={icon}
      onClick={setIsShowReplies}
      sx={{ alignSelf: 'flex-start' }}
      variant="subtle"
      small
    >
      {text}
    </Button>
  )
}
