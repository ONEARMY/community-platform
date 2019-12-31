import React, { FunctionComponent } from 'react'
import { IHowto } from '../../models/howto.models'
import { IEvent } from 'src/models/events.models'
import { Box } from 'rebass'
import Text from 'src/components/Text'

interface IProps {
  howto?: IHowto
  event?: IEvent
  top?: string
}

export const ModerationStatusText: FunctionComponent<IProps> = ({
  howto,
  event,
  top,
}) => {
  let type = ''
  let text = ''
  let status = ''
  if (!howto && !event) {
    return null
  }

  if (howto) {
    status = howto.moderation
    type = 'howto'
  }
  if (event) {
    status = event.moderation
    type = 'event'
    status = 'draft' !== status ? status : ''
  }

  switch (status) {
    case 'accepted':
      return null
      break
    case 'rejected':
      text = 'howto' === type ? 'Needs to improve to be accepted' : 'Rejected'
      break
    case 'draft':
      text = 'Draft'
      break
    default:
      text = 'Awaiting moderation'
      break
  }

  return (
    <Text
      small
      clipped
      highlight
      critical={status === 'rejected'}
      sx={{
        position: 'absolute',
        maxWidth: '90%',
        right: '0',
        top: top ? top : 'auto',
      }}
    >
      {text}
    </Text>
  )
}

export default ModerationStatusText
