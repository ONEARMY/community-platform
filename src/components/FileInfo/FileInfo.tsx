import * as React from 'react'
import { availableGlyphs } from '../Icons'
import { bytesToSize } from '../ImageInput/ImageInput'
import { IUploadedFileMeta } from 'src/stores/storage'
import { FileDetails } from './FileDetails'

interface IProps {
  file: File | IUploadedFileMeta
  allowDownload?: boolean
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
    return (
      <>
        {allowDownload && meta.downloadUrl ? (
          <a href={meta.downloadUrl} target="_blank" download={file.name}>
            <FileDetails file={file} glyph={glyph} size={size} />
          </a>
        ) : (
          <FileDetails file={file} glyph={glyph} size={size} />
        )}
      </>
    )
  }
}
