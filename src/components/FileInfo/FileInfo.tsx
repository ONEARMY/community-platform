import * as React from 'react'
import { availableGlyphs } from '../Icons'
import { bytesToSize } from '../ImageInput/ImageInput'
import { IUploadedFileMeta } from 'src/stores/storage'
import { FileDetails } from './FileDetails'
import styled from 'styled-components'

interface IProps {
  file: File | IUploadedFileMeta | null
  allowDownload?: boolean
}
interface IState {
  glyph: availableGlyphs
  size: string
}

const FileContainer = styled.a`
  width: 300px;
  margin: 3px 3px;
`

export class FileInfo extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      glyph: props.file ? this.getGlyph(props.file.type) : 'image',
      size: props.file ? bytesToSize(props.file.size) : '0',
    }
  }

  getGlyph(filetype: string): availableGlyphs {
    let glyph: availableGlyphs = 'download-cloud'
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
    const { file, allowDownload } = this.props
    const { glyph, size } = this.state
    const meta = file as IUploadedFileMeta

    if (!file) {
      return null
    }

    return (
      <>
        {allowDownload && meta.downloadUrl ? (
          <FileContainer
            href={meta.downloadUrl}
            target="_blank"
            download={file.name}
          >
            <FileDetails file={file} glyph={glyph} size={size} />
          </FileContainer>
        ) : (
          <FileDetails file={file} glyph={glyph} size={size} />
        )}
      </>
    )
  }
}
