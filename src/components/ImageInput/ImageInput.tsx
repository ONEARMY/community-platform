import * as React from 'react'
import { Box, Flex, Image } from 'rebass'
import styled from 'styled-components'
import { Button } from '../Button'
import 'react-image-lightbox/style.css'
import { ImageConverter } from './ImageConverter'
import theme from 'src/themes/styled.theme'
import Dropzone from 'react-dropzone'

interface ITitleProps {
  hasUploadedImg: boolean
}

const AlignCenterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  overflow: hidden;
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

const UploadImageOverlay = styled(AlignCenterWrapper)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  opacity:0;
  visibility:hidden
  transition: opacity 300ms ease-in;
  border-radius: ${theme.space[1]}px;
  ${ImageInputWrapper}:hover & {
    visibility: visible;
    opacity: 1;
  }
`

/*
    This component takes multiple image using filepicker and resized clientside
    Note, typings not available for client-compress so find full options here:
    https://github.com/davejm/client-compress
*/

interface IProps {
  // if multiple sends array, otherwise single object (or null on delete)
  onFilesChange: (
    fileMeta: IConvertedFileMeta[] | IConvertedFileMeta | null,
  ) => void
  imageSrc?: string
  hasText?: boolean
  replaceImage?: boolean
  canDelete?: boolean
  multiple?: boolean
}
const defaultProps: IProps = {
  onFilesChange: () => null,
  multiple: false,
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
  inputFiles: File[]
  lightboxImg?: IConvertedFileMeta
  openLightbox?: boolean
}

export class ImageInput extends React.Component<IProps, IState> {
  static defaultProps = defaultProps

  private fileInputRef = React.createRef<HTMLInputElement>()

  constructor(props: IProps) {
    super(props)
    this.state = {
      inputFiles: [],
      convertedFiles: [],
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

  public handleConvertedFileChange(file: IConvertedFileMeta, index: number) {
    const { convertedFiles } = this.state
    convertedFiles[index] = file
    this.setState({
      convertedFiles,
    })
    const value = this.props.multiple ? convertedFiles : convertedFiles[0]
    this.props.onFilesChange(value)
  }

  public handleImageDelete(event: Event) {
    event.stopPropagation()
    this.setState({
      inputFiles: [],
      convertedFiles: [],
    })
    this.props.onFilesChange(null)
  }

  render() {
    const { inputFiles } = this.state
    const { imageSrc, multiple } = this.props
    // if at least one image present, hide the 'choose image' button and replace with smaller button
    const imgPreviewMode = inputFiles.length > 0 || imageSrc
    const useImageSrc = imageSrc && this.state.inputFiles.length === 0
    return (
      <Box p={0} height="100%">
        <Dropzone
          accept="image/*"
          multiple={multiple}
          onDrop={this.handleFileUpload}
        >
          {({ getRootProps, getInputProps }) => (
            <ImageInputWrapper
              hasUploadedImg={!!imgPreviewMode}
              {...getRootProps()}
            >
              <input {...getInputProps()} />

              {imageSrc && <Image src={imageSrc} />}

              {!useImageSrc &&
                inputFiles.map((file, index) => {
                  return (
                    <ImageConverter
                      key={file.name}
                      file={file}
                      onImgConverted={meta =>
                        this.handleConvertedFileChange(meta, index)
                      }
                    />
                  )
                })}

              {!useImageSrc && !imgPreviewMode && (
                <Button small variant="outline" icon="image">
                  Upload Image
                </Button>
              )}

              <UploadImageOverlay>
                {this.props.canDelete && imgPreviewMode && (
                  <Button
                    data-cy="delete-image"
                    small
                    variant="outline"
                    icon="delete"
                    onClick={event => this.handleImageDelete(event)}
                  >
                    Delete
                  </Button>
                )}

                {!this.props.canDelete && (
                  <Button
                    small
                    variant="outline"
                    icon="image"
                    data-cy="replace-image"
                  >
                    Replace image
                  </Button>
                )}
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
