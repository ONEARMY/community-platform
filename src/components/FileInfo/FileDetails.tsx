import * as React from 'react'
import Icon, { availableGlyphs } from '../Icons'
import { FlexContainer } from '../Layout/FlexContainer'
import Text from '../Text'
import { IUploadedFileMeta } from 'src/stores/storage'
import styled from 'styled-components'
import theme from 'src/themes/styled.theme'

interface IProps {
  file: File | IUploadedFileMeta
  glyph: availableGlyphs
  size: string
}

const FileFlexContainer = styled(FlexContainer)`
  border: 2px solid black;
  background-color: ${theme.colors.yellow};
  color: black;
`

export const FileDetails = (props: IProps) => (
  <FileFlexContainer
    p={2}
    mb={1}
    justifyContent="space-between"
    alignItems="center"
  >
    <Icon size={24} glyph={props.glyph} mr={3} />
    <Text small clipped={true} flex={1} mr={3}>
      {props.file.name}
    </Text>
    <Text small>{props.size}</Text>
  </FileFlexContainer>
)
