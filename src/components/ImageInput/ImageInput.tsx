import * as React from 'react'
import { BoxContainer } from '../Layout/BoxContainer'

import { Button } from '../Button'
import { FlexContainer } from '../Layout/FlexContainer'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'
import Text from '../Text'

/*
    This component takes multiple imageusing filepicker and resized clientside
    Note, typings not available for client-compress so find full options here:
    https://github.com/davejm/client-compress
*/

interface IProps {
  onFilesChange?: (fileMeta: IConvertedFileMeta[]) => void
  text?: string
}

export interface IConvertedFileMeta {
  startSize: string
  endSize: string
  compressionPercent: number
  photoData: Blob
  objectUrl: string
  name: string
  type: string
}

interface IState {
  convertedFiles: IConvertedFileMeta[]
  openLightbox?: boolean
}

export class ImageInput extends React.Component<IProps, IState> {
  private fileInputRef = React.createRef<HTMLInputElement>()

  constructor(props: IProps) {
    super(props)
    this.state = { convertedFiles: [] }
  }
  get inputFiles() {
    const filesRef = this.fileInputRef.current as HTMLInputElement
    return filesRef.files
  }

  // on mount add listener to automatically convert images on file pick
  // componentDidMount() {
  //   const inputRef = this.fileInputRef.current as HTMLInputElement
  //   inputRef.addEventListener(
  //     'change',
  //     e => {
  //       if (this.inputFiles) {
  //         this.compressFiles(this.inputFiles)
  //       }
  //     },
  //     false,
  //   )
  // }
  componentWillUnmount() {
    // Revoke the object URL to free up memory
    this.state.convertedFiles.forEach(file => {
      URL.revokeObjectURL(file.objectUrl)
    })
  }

  public triggerCallback() {
    if (this.props.onFilesChange) {
      this.props.onFilesChange(this.state.convertedFiles)
    }
  }

  public triggerFileUploaderClick() {
    const inputRef = this.fileInputRef.current as HTMLInputElement
    inputRef.click()
  }

  render() {
    const { convertedFiles, openLightbox } = this.state
    const { text } = this.props
    const imgPreviewMode = convertedFiles[0] ? true : false
    return (
      <BoxContainer width="380px" p={0}>
        <>
          <div
            style={{
              display: imgPreviewMode ? 'none' : 'flex',
              flexDirection: 'column',
              border: '1px solid #dddddd',
              justifyContent: 'center',
              height: '230px',
            }}
          >
            <Text regular textAlign="center" mb={2}>
              {text ? text : 'Image'}
            </Text>
            <Button
              variant="outline"
              onClick={() => this.triggerFileUploaderClick()}
              icon="image"
            >
              Choose Image
            </Button>
            <input
              type="file"
              name="pic"
              accept="image/*"
              multiple
              ref={this.fileInputRef}
              style={{ display: 'none' }}
            />
          </div>
          {convertedFiles.map(file => {
            return <div key={file.name}>Placeholder</div>
          })}

          {openLightbox && (
            <Lightbox
              mainSrc={convertedFiles[0].objectUrl}
              onCloseRequest={() => this.setState({ openLightbox: false })}
            />
          )}
        </>
      </BoxContainer>
    )
  }
}

/************************************************************************************
 *    Exported helpers (could be moved to appropriate utils)
 *
 *************************************************************************************/

export const bytesToSize = (bytes: number) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) {
    return '0 Byte'
  }
  const i = Number(Math.floor(Math.log(bytes) / Math.log(1024)))
  const size = (bytes / Math.pow(1024, i)).toPrecision(3) + ' ' + sizes[i]
  return size
}

/************************************************************************************
 *    Interfaces
 *
 *************************************************************************************/

type imageFormats = 'image/jpeg' | 'image/jpg' | 'image/gif' | 'image/png'
// NOTE - gifs will lose animation and png will lost transparency
// Additional types: image/bmp, image/tiff, image/x-icon,  image/svg+xml, image/webp, image/xxx
