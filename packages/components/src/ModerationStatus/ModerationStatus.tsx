import { Text } from 'theme-ui'

import type { Moderation } from 'oa-shared'
import type { ThemeUIStyleObject } from 'theme-ui'

export const ModerationRecord: Record<Moderation, string> = {
  'awaiting-moderation': 'Awaiting Moderation',
  'improvements-needed': 'Improvements Needed',
  accepted: 'Accepted',
  rejected: 'Rejected',
}

export interface Props {
  status: Moderation
  sx?: ThemeUIStyleObject
}

export const ModerationStatus = (props: Props) => {
  const { status, sx } = props

  return (
    <Text
      sx={{
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
        ...sx,
      }}
      data-cy={`moderationstatus-${status}`}
    >
      {ModerationRecord[status]}
    </Text>
  )
}
