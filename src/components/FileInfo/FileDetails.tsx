import type { availableGlyphs } from 'oa-components'
import { Icon } from 'oa-components'
import { Flex, Text } from 'theme-ui'
import type { IUploadedFileMeta } from 'src/stores/storage'
import styled from '@emotion/styled'
import theme from 'src/themes/styled.theme'

interface IProps {
  file: File | IUploadedFileMeta
  glyph: availableGlyphs
  size: string
}

const FileFlex = styled(Flex)`
  border: 2px solid black;
  border-radius: 5px;
  background-color: ${theme.colors.yellow.base};
  color: black;
`

export const FileDetails = (props: IProps) => (
  <FileFlex
    p={2}
    mb={1}
    sx={{
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      width: '300px',
    }}
  >
    <Icon size={24} glyph={props.glyph} mr={3} />
    <Text
      sx={{
        flex: 1,
        fontSize: 1,
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
      }}
      mr={3}
    >
      {props.file.name}
    </Text>
    <Text sx={{ fontSize: 1 }}>{props.size}</Text>
  </FileFlex>
)
