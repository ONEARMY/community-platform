import { Link } from 'react-router-dom'
import { Icon } from 'oa-components'
import { bytesToSize } from 'oa-shared'
import { Flex, IconButton, Text } from 'theme-ui'

const textStyle = {
  flex: 1,
  fontSize: 1,
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  mr: 3,
}

export const FileDisplay = (props: {
  id: string
  name: string
  size?: number
  url?: string
  onRemove: (id: string) => void
}) => {
  return (
    <Flex
      key={props.id}
      sx={{ width: 'fit-content', alignItems: 'center', gap: 1 }}
    >
      <Icon size={24} glyph="download-cloud" mr={3} />
      <Text sx={textStyle}>
        {props.url ? (
          <Link to={props.url} target="_blank">
            {props.name}
          </Link>
        ) : (
          props.name
        )}
      </Text>
      {props.size && (
        <Text sx={{ fontSize: 1 }}>{bytesToSize(props.size)}</Text>
      )}

      <IconButton
        onClick={() => props.onRemove(props.id)}
        type="button"
        sx={{ ':hover': { cursor: 'pointer' } }}
      >
        <Icon size={16} glyph="close" />
      </IconButton>
    </Flex>
  )
}
