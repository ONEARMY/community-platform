import * as React from 'react'
import { Box, Flex, Image } from 'rebass'
import styled from 'styled-components'
import { Button } from '../Button'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'
import { ImageConverter } from './ImageConverter'
import { IUploadedFileMeta } from 'src/stores/storage'
import theme from 'src/themes/styled.theme'
import Dropzone from 'react-dropzone'

interface ITitleProps {
  hasUploadedImg: boolean
}

interface IUploadImageOverlayIProps {
  isHovering: boolean
}

const AlignCenterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`

const ImageInputWrapper = styled(AlignCenterWrapper)<ITitleProps>`
  position: relative;
  height: 100%;
  width: 100%;
  border: ${props =>
    props.hasUploadedImg ? 0 : `2px dashed ${theme.colors.background}`};
  border-radius: ${theme.space[1]}px;
  background-color: ${theme.colors.white};
  cursor: pointer;
`

const UploadImageOverlay = styled(AlignCenterWrapper)<
  IUploadImageOverlayIProps
>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  visibility: hidden;
  opacity: 0;
  transition: opacity 300ms ease-in;
  border-radius: ${theme.space[1]}px;

  ${(props: IUploadImageOverlayIProps) =>
    props.isHovering &&
    `
    visibility: visible;
    opacity: 1;
  `}
`

/*
    This component takes multiple imageusing filepicker and resized clientside
    Note, typings not available for client-compress so find full options here:
    https://github.com/davejm/client-compress
*/

interface IProps {
  onFilesChange: (fileMeta: IConvertedFileMeta[] | null) => void
  multi?: boolean
  src?: IUploadedFileMeta
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
  isHovering: boolean
}

export class ImageInput extends React.Component<IProps, IState> {
  private fileInputRef = React.createRef<HTMLInputElement>()

  constructor(props: IProps) {
    super(props)
    this.state = {
      inputFiles: [],
      convertedFiles: [],
      isHovering: false,
    }
  }

  public handleFileUpload = (filesToUpload: Array<File>) => {
    this.setState({ inputFiles: filesToUpload })
  }

  get inputFiles() {
    const filesRef = this.fileInputRef.current as HTMLInputElement
    const files = filesRef.files
    return files ? Array.from(files) : []
  }

  // on mount add listener to automatically convert images on file pick
  componentDidMount() {
    // const inputRef = this.fileInputRef.current as HTMLInputElement
    // inputRef.addEventListener(
    //   'change',
    //   e => {
    //     this.setState({ inputFiles: this.inputFiles })
    //   },
    //   false,
    // )
  }

  // public triggerFileUploaderClick() {
  //   const inputRef = this.fileInputRef.current as HTMLInputElement
  //   inputRef.click()
  // }

  public handleConvertedFileChange(
    isMulti: boolean,
    file: IConvertedFileMeta,
    index: number,
  ) {
    console.log('handleConvertedFileChange', file)
    let updatedCovertedFiles: Array<any> | any = []

    if (isMulti) {
      updatedCovertedFiles = this.state.convertedFiles.concat(file)
    } else {
      updatedCovertedFiles = file
    }

    this.setState({
      convertedFiles: updatedCovertedFiles,
      imgDelivered: true,
    })

    console.log(this.state)
    console.log('updatedCovertedFiles', updatedCovertedFiles)

    if (this.props.onFilesChange) {
      this.props.onFilesChange(updatedCovertedFiles)
    }
  }

  public toggleImageOverlay = () => {
    if (this.state.inputFiles.length === 0) {
      // If there is no image selected/uploaded
      // Don't toggle it.
      return
    }
    this.setState((prevState: Readonly<IState>) => ({
      isHovering: !prevState.isHovering,
    }))
  }

  render() {
    const {
      inputFiles,
      openLightbox,
      lightboxImg,
      imgDelivered,
      isHovering,
    } = this.state
    // if at least one image present, hide the 'choose image' button and replace with smaller button
    const imgPreviewMode = inputFiles.length > 0 || this.props.src
    const useImageSrc = this.props.src && this.state.inputFiles.length === 0

    console.log('inputFiles', inputFiles)
    console.log('imgPreviewMode', imgPreviewMode)
    console.log('useImageSrc', useImageSrc)

    return (
      <Box p={0} height="100%">
        <Dropzone
          accept="image/*"
          multiple={false}
          onDrop={this.handleFileUpload}
        >
          {({ getRootProps, getInputProps }) => (
            <ImageInputWrapper
              hasUploadedImg={!!imgPreviewMode}
              onMouseEnter={this.toggleImageOverlay}
              onMouseLeave={this.toggleImageOverlay}
              {...getRootProps()}
            >
              <input {...getInputProps()} />

              {useImageSrc && this.props.src && (
                <Image src={this.props.src.downloadUrl} />
              )}
              {!useImageSrc &&
                inputFiles.map((file, index) => {
                  return (
                    <ImageConverter
                      key={file.name}
                      file={file}
                      onImgConverted={meta =>
                        this.handleConvertedFileChange(
                          this.props.multi === true,
                          meta,
                          index,
                        )
                      }
                    />
                  )
                })}
              {!useImageSrc && !imgPreviewMode && (
                <Button small variant="outline" icon="image">
                  {this.props.multi ? 'Choose Image(s)' : 'Choose Image'}
                </Button>
              )}

              <UploadImageOverlay isHovering={isHovering}>
                <Button
                  small
                  variant="outline"
                  icon="delete"
                  onClick={event => {
                    event.stopPropagation()
                    if (imgPreviewMode) {
                      this.props.onFilesChange(null)
                    }

                    this.setState({
                      inputFiles: [],
                      convertedFiles: [],
                      isHovering: false,
                    })
                  }}
                >
                  Delete
                </Button>
              </UploadImageOverlay>
            </ImageInputWrapper>
          )}
        </Dropzone>
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
