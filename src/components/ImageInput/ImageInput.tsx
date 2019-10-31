import * as React from 'react'
import { Box, Flex } from 'rebass'
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
  multi?: boolean
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
  imgDelivered?: boolean
  inputFiles: File[]
  lightboxImg?: IConvertedFileMeta
  openLightbox?: boolean
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

  public triggerFileUploaderClick() {
    const inputRef = this.fileInputRef.current as HTMLInputElement
    inputRef.click()
  }

  public handleConvertedFileChange(file: IConvertedFileMeta, index: number) {
    const { convertedFiles } = this.state
    const updatedCovertedFiles = convertedFiles.concat(file)

    this.setState(() => ({
      convertedFiles: updatedCovertedFiles,
      imgDelivered: true,
    }))

    if (this.props.onFilesChange) {
      this.props.onFilesChange(updatedCovertedFiles)
    }
  }

  public showImgLightbox(file: IConvertedFileMeta) {
    this.setState({
      openLightbox: true,
      lightboxImg: file,
    })
  }

  public handleFileInput(files: FileList | null) {
    this.setState(() => ({
      imgDelivered: false,
    }))
  }

  render() {
    const { inputFiles, openLightbox, lightboxImg, imgDelivered } = this.state
    // if at least one image present, hide the 'choose image' button and replace with smaller button
    const imgPreviewMode = inputFiles.length > 0
    return (
      <Box p={0}>
        <>
          <div
            style={{
              opacity: imgPreviewMode ? 0 : 1, // prevent FOUC when image appears
              display: imgDelivered ? 'none' : 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '230px',
              alignItems: 'center',
              backgroundColor: '#e0e0e0',
              borderRadius: '5px',
              // ideally width should fill container around 300px for 4:3
            }}
          >
            <Button
              variant="outline"
              onClick={() => this.triggerFileUploaderClick()}
              icon="image"
            >
              {this.props.multi ? 'Choose Image(s)' : 'Choose Image'}
            </Button>
            <input
              type="file"
              name="pic"
              accept="image/jpeg,image/png"
              multiple={this.props.multi}
              ref={this.fileInputRef}
              style={{ display: 'none' }}
              onChange={e => {
                this.handleFileInput(e.target.files)
              }}
            />
          </div>
          <Flex mx={-1}>
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
              <Flex width={1 / 4} px={1}>
                <Button
                  onClick={() => this.triggerFileUploaderClick()}
                  ml="auto"
                  icon="image"
                  variant="imageInput"
                  width={1}
                />
              </Flex>
            )}
          </Flex>

          {openLightbox && (
            <Lightbox
              mainSrc={lightboxImg!.objectUrl}
              onCloseRequest={() => this.setState({ openLightbox: false })}
            />
          )}
        </>
      </Box>
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
