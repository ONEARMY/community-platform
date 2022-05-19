import { useTheme } from '@emotion/react'
import type { FunctionComponent } from 'react'
import { Text } from 'theme-ui'
import type { IModerable } from 'src/models'

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
}) => {
  const theme = useTheme()
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
      sx={{
        position: 'absolute',
        maxWidth: '90%',
        color: status === 'rejected' ? theme.colors.red : 'black',
        right: '0',
        top: top ? top : 'auto',
        bottom: bottom ? bottom : 'auto',
        fontSize: 1,
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        background: theme.colors.yellow.base,
        padding: '7px',
        borderRadius: '5px',
        borderBottomRightRadius: '8px',
      }}
    >
      {text}
    </Text>
  )
}

export default ModerationStatusText
