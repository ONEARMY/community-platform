import * as React from 'react'
import Icon, { availableGlyphs } from '../Icons'
import { FlexContainer } from '../Layout/FlexContainer'
import Text from '../Text'
import { IUploadedFileMeta } from 'src/stores/storage'
import Theme from 'src/themes/styled.theme'

interface IProps {
  file: File | IUploadedFileMeta
  glyph: availableGlyphs
  size: string
}

export const FileDetails = (props: IProps) => (
  <FlexContainer
    p={2}
    m={0}
    mb={1}
    justifyContent="space-between"
    alignItems="center"
    width="300px"
  >
    <Icon size={24} glyph={props.glyph} marginRight="4px" />
    <Text small clipped={true} flex={1}>
      {props.file.name}
    </Text>
    <Text small>{props.size}</Text>
  </FlexContainer>
)
