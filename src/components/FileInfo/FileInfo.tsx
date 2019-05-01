import * as React from 'react'
import Icon, { availableGlyphs } from '../Icons'
import { FlexContainer } from '../Layout/FlexContainer'
import Text from '../Text'
import { bytesToSize } from '../ImageInput/ImageInput'

interface IProps {
  file: File
}
interface IState {
  glyph: availableGlyphs
  size: string
}
export class FileInfo extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      glyph: this.getGlyph(props.file.type),
      size: bytesToSize(props.file.size),
    }
  }

  getGlyph(filetype: string) {
    let glyph: availableGlyphs = 'image'
    console.log('getting glyph', filetype)
    switch (filetype) {
      case 'application/pdf':
        glyph = 'pdf'
        break
      default:
        break
    }
    return glyph
  }
  render() {
    const { file } = this.props
    return (
      <FlexContainer
        p={0}
        mb={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <Icon size={24} glyph={this.state.glyph} marginRight="4px" />
        <Text clipped={true} flex={1}>
          {file.name}
        </Text>
        <Text small>{this.state.size}</Text>
      </FlexContainer>
    )
  }
}
