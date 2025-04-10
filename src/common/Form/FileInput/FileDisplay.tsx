import { Link } from 'react-router-dom'
import { Icon } from 'oa-components'
import { bytesToSize } from 'oa-shared'
import { Flex, IconButton, Text } from 'theme-ui'

import type { MediaFile } from 'oa-shared'

const textStyle = {
  flex: 1,
  fontSize: 1,
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  mr: 3,
}

type FileDisplayProps = {
  file: MediaFile
  onRemove: () => void
}

export const FileDisplay = ({ file, onRemove }: FileDisplayProps) => {
  return (
    <Flex
      key={file.id}
      sx={{ width: 'fit-content', alignItems: 'center', gap: 1 }}
    >
      <Icon size={24} glyph="download-cloud" mr={3} />
      <Text sx={textStyle}>
        {file.url ? (
          <Link to={file.url} target="_blank">
            {file.name}
          </Link>
        ) : (
          file.name
        )}
      </Text>
      {file.size && <Text sx={{ fontSize: 1 }}>{bytesToSize(file.size)}</Text>}

      <IconButton
        onClick={onRemove}
        type="button"
        sx={{ ':hover': { cursor: 'pointer' } }}
      >
        <Icon size={16} glyph="close" />
      </IconButton>
    </Flex>
  )
}
