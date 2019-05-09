import * as React from 'react'
import { BoxContainer } from '../Layout/BoxContainer'
import { Button } from '../Button'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'
import { ImageConverter } from './ImageConverter'

/*
    This component takes multiple imageusing filepicker and resized clientside
    Note, typings not available for client-compress so find full options here:
    https://github.com/davejm/client-compress
*/

interface IProps {
  onFilesChange?: (fileMeta: IConvertedFileMeta[]) => void
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
  inputFiles: File[]
  convertedFiles: IConvertedFileMeta[]
  openLightbox?: boolean
  lightboxImg?: IConvertedFileMeta
}

export class ImageInput extends React.Component<IProps, IState> {
  private fileInputRef = React.createRef<HTMLInputElement>()

  constructor(props: IProps) {
    super(props)
    this.state = { inputFiles: [], convertedFiles: [] }
  }
  get inputFiles() {
    const filesRef = this.fileInputRef.current as HTMLInputElement
    const files = filesRef.files
    return files ? Array.from(files) : []
  }

  // on mount add listener to automatically convert images on file pick
  componentDidMount() {
    const inputRef = this.fileInputRef.current as HTMLInputElement
    inputRef.addEventListener(
      'change',
      e => {
        this.setState({ inputFiles: this.inputFiles })
      },
      false,
    )
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

  public handleConvertedFileChange(file: IConvertedFileMeta, index: number) {
    const { convertedFiles } = this.state
    convertedFiles[index] = file
    this.setState({ convertedFiles })
    this.triggerCallback()
  }

  public showImgLightbox(file: IConvertedFileMeta) {
    this.setState({
      openLightbox: true,
      lightboxImg: file,
    })
  }

  render() {
    const { inputFiles, openLightbox, lightboxImg } = this.state
    // if at least one image present, hide the 'choose image' button and replace with smaller button
    const imgPreviewMode = inputFiles.length > 0
    return (
      <BoxContainer p={0}>
        <>
          <div
            style={{
              display: imgPreviewMode ? 'none' : 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '230px',
              // ideally width should fill container around 300px for 4:3
            }}
          >
            <Button
              variant="light"
              onClick={() => this.triggerFileUploaderClick()}
              icon="image"
            >
              Choose Image(s)
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
          {inputFiles.map((file, index) => {
            return (
              <ImageConverter
                key={file.name}
                file={file}
                onImgConverted={meta =>
                  this.handleConvertedFileChange(meta, index)
                }
                onImgClicked={meta => this.showImgLightbox(meta)}
              />
            )
          })}
          {imgPreviewMode && (
            <Button
              onClick={() => this.triggerFileUploaderClick()}
              ml="auto"
              icon="image"
              variant="light"
              width={1}
            >
              Choose Images
            </Button>
          )}

          {openLightbox && (
            <Lightbox
              mainSrc={lightboxImg!.objectUrl}
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
