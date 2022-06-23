import type { ThemeUIStyleObject } from 'theme-ui'
import { Text } from 'theme-ui'

export interface Props {
  status: string
  contentType: 'event' | 'howto' | 'research'
  sx?: ThemeUIStyleObject
}

export const ModerationStatus = (props: Props) => {
  const { contentType, sx } = props
  let { status } = props

  if (status === 'accepted') {
    // If the content has been accepted we should bail out
    // early and not render the `ModerationStatus` component.
    return null
  }

  if (contentType === 'event') {
    status = 'draft' !== status ? status : 'awaiting-moderation'
  }

  let moderationMessage = ''
  switch (status) {
    case 'rejected':
      moderationMessage =
        'howto' === contentType ? 'Needs to improve to be accepted' : 'Rejected'
      break
    case 'draft':
      moderationMessage = 'Draft'
      break
    case 'awaiting-moderation':
      moderationMessage = 'Awaiting moderation'
      break
    default:
      moderationMessage = 'Awaiting moderation'
      break
  }

  return (
    <Text
      sx={{
        ...sx,
        display: 'inline-block',
        color: status === 'rejected' ? 'red' : 'black',
        fontSize: 1,
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        background: 'yellow.base',
        padding: 1,
        borderRadius: 1,
        borderBottomRightRadius: 1,
      }}
    >
      {moderationMessage}
    </Text>
  )
}
