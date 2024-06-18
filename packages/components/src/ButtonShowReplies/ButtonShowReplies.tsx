import { Button } from '../Button/Button'
import { nonDeletedCommentsCount } from '../DiscussionTitle/DiscussionTitle'

import type { IComment } from '../CommentItem/types'

export interface Props {
  creatorName: string | null
  isShowReplies: boolean
  replies: IComment[]
  setIsShowReplies: () => void
}

export const ButtonShowReplies = (props: Props) => {
  const { creatorName, isShowReplies, replies, setIsShowReplies } = props

  const count = nonDeletedCommentsCount(replies)
  const icon = isShowReplies ? 'arrow-full-up' : 'arrow-full-down'

  const text = count ? `${count} ${count === 1 ? 'reply' : 'replies'}` : `Reply`

  return (
    <Button
      data-cy={`show-replies`}
      icon={icon}
      onClick={setIsShowReplies}
      sx={{ alignSelf: 'flex-start', border: 'none' }}
      variant="outline"
      small
    >
      {/* {text} {creatorName && ` to ${creatorName}`} */}
      {text}
    </Button>
  )
}
