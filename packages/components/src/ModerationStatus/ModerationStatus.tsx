import { Text } from 'theme-ui'

import type { ThemeUIStyleObject } from 'theme-ui'

export interface ModerationStatusProps {
  status: string
  contentType: 'event' | 'howto' | 'research' | 'question'
  sx?: ThemeUIStyleObject
}

export const ModerationStatus = (props: ModerationStatusProps) => {
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
        background: 'accent.base',
        padding: 1,
        borderRadius: 1,
        borderBottomRightRadius: 1,
      }}
      data-cy={`moderationstatus-${status}`}
    >
      {moderationMessage}
    </Text>
  )
}
