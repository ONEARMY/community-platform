import { Button } from '../Button/Button'

import type { IComment } from '../CommentItem/types'

export interface Props {
  creatorName: string
  isShowReplies: boolean
  replies: IComment[]
  setIsShowReplies: () => void
}

export const ButtonShowReplies = (props: Props) => {
  const { creatorName, isShowReplies, replies, setIsShowReplies } = props

  const length = replies && replies.length ? replies.length : 0
  const icon = isShowReplies ? 'arrow-full-up' : 'arrow-full-down'

  const text = length
    ? `${length} ${length === 1 ? 'reply' : 'replies'}`
    : `Reply`

  return (
    <Button
      data-cy={`show-replies`}
      icon={icon}
      onClick={setIsShowReplies}
      sx={{ alignSelf: 'flex-start' }}
      variant="outline"
      small
    >
      {`${text} to ${creatorName}`}
    </Button>
  )
}
