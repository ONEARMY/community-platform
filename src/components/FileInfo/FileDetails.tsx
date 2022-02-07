import Icon, { availableGlyphs } from '../Icons'
import { Flex } from 'rebass/styled-components'
import Text from '../Text'
import { IUploadedFileMeta } from 'src/stores/storage'
import styled from 'styled-components'
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
    justifyContent="space-between"
    alignItems="center"
    flexDirection={'row'}
    width={'300px'}
  >
    <Icon size={24} glyph={props.glyph} mr={3} />
    <Text small clipped={true} flex={1} mr={3}>
      {props.file.name}
    </Text>
    <Text small>{props.size}</Text>
  </FileFlex>
)
