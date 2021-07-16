import { FunctionComponent } from 'react';
import Text from 'src/components/Text'
import { IModerable } from 'src/models'

type IProps = {
  moderatedContent: IModerable
  contentType: 'event' | 'howto' | 'research'
  top?: string
  bottom?: string | (string | number)[]
  cropBottomRight?: boolean
}

export const ModerationStatusText: FunctionComponent<IProps> = ({
  moderatedContent,
  contentType,
  top,
  bottom,
  cropBottomRight,
}) => {
  let status = moderatedContent.moderation
  if (contentType === 'event') {
    status = 'draft' !== status ? status : 'awaiting-moderation'
  }

  let text = ''
  switch (status) {
    case 'accepted':
      return null
      // eslint-disable-next-line
      break
    case 'rejected':
      text =
        'howto' === contentType ? 'Needs to improve to be accepted' : 'Rejected'
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
