import React, { FunctionComponent } from 'react'
import { TextProps } from 'rebass'
import Text from 'src/components/Text'
import { IModerable } from 'src/models'

type IProps = {
  moderable: IModerable
  kind: 'event' | 'howto' | 'research'
  top?: string
  bottom?: string | (string | number)[]
  cropBottomRight?: boolean
} & TextProps

export const ModerationStatusText: FunctionComponent<IProps> = ({
  moderable,
  kind,
  top,
  bottom,
  cropBottomRight,
}) => {
  let status = moderable.moderation
  if (kind === 'event') {
    status = 'draft' !== status ? status : 'awaiting-moderation'
  }

  let text = ''
  switch (status) {
    case 'accepted':
      return null
      // eslint-disable-next-line
      break
    case 'rejected':
      text = 'howto' === kind ? 'Needs to improve to be accepted' : 'Rejected'
      break
    case 'draft':
      text = 'Draft'
      break
    case 'awaiting-moderation':
      text = 'Awaiting moderation'
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
      cropBottomRight={cropBottomRight}
      sx={{
        position: 'absolute',
        maxWidth: '90%',
        color: 'black',
        right: '0',
        top: top ? top : 'auto',
        bottom: bottom ? bottom : 'auto',
      }}
    >
      {text}
    </Text>
  )
}

export default ModerationStatusText
