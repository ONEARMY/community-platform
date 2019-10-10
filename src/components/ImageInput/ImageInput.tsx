import * as React from 'react'
import { Box, Image } from 'rebass'
import { Button } from '../Button'
import Dropzone from 'react-dropzone'
import theme from 'src/themes/styled.theme'
import { ImageConverter } from './ImageConverter'
import { IUploadedFileMeta } from 'src/stores/storage'

import styled from 'styled-components'

interface IState {
  isHovering: boolean
  fileToUpload: File | IUploadedFileMeta | null
}

interface IProps {
  onFilesChange: (
    fileMeta: File | IUploadedFileMeta | IConvertedFileMeta,
  ) => void
  multi?: boolean
  canDelete?: boolean
  hasText?: boolean
  value: File | IUploadedFileMeta | null
  index?: number
  onDelete?: (fileMeta: File | IUploadedFileMeta | IConvertedFileMeta) => void
}

interface IUploadImageOverlayIProps {
  isHovering: boolean
}

interface ITitleProps {
  readonly onMouseEnter: object | null
  hasUploadedImg: boolean
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

const AlignCenterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`

const UploadImageWrapper = styled(AlignCenterWrapper)<ITitleProps>`
  position: relative;
  height: 100%;
  width: 100%;
  border: 2px dashed ${theme.colors.lightGrey};
  border-radius: ${theme.space[1]}px;
  background-color: ${theme.colors.white};

  ${props =>
    props.hasUploadedImg &&
    `
    border: none;
  `}
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

export class ImageInput extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      fileToUpload: null,
      isHovering: false,
    }
  }

  componentDidMount() {
    console.log('value', this.props.value)
    if (this.props.value) {
      this.setState({
        fileToUpload: this.props.value,
      })
    }
  }

  componentDidUpdate(prevProps) {
    console.log('prev props', prevProps, this.props)
    if (prevProps.value !== this.props.value) {
      this.setState({
        fileToUpload: this.props.value,
      })
    }
  }

  public handleConvertedFileChange(file: IConvertedFileMeta) {
    if (this.props.onFilesChange) {
      this.props.onFilesChange(file)
    }
  }

  public toggleImageOverlay = () => {
    const { fileToUpload } = this.state
    if (!fileToUpload) {
      // If there is no image selected/uploaded
      // Don't toggle it.
      return
    }

    this.setState((prevState: Readonly<IState>) => ({
      isHovering: !prevState.isHovering,
    }))
  }

  public renderImage(file: File | IUploadedFileMeta) {
    console.log('file', file)
    let imagePreview

    // For compressed image preview File
    if (file instanceof File) {
      const fileObj = file as File
      imagePreview = (
        <ImageConverter
          key={fileObj.name}
          file={fileObj}
          onImgConverted={meta => this.handleConvertedFileChange(meta)}
        />
      )
    }

    // For the photo coming from the API
    if (!(file instanceof File) && file) {
      const fileObj = file as IUploadedFileMeta
      imagePreview = <Image src={fileObj.downloadUrl} />
    }

    return imagePreview
  }

  render() {
    const { fileToUpload, isHovering } = this.state
    const { canDelete } = this.props

    const hasUploadedImg = !!fileToUpload

    return (
      <Box p={0} style={{ height: '100%' }}>
        <Dropzone
          accept="image/*"
          multiple={false}
          onDrop={(files: Array<File>) => {
            // const files = filesToUpload ? Array.from(filesToUpload) : []
            this.setState({ fileToUpload: files[0] })
            // this.handleConvertedFileChange(fileToUpload[0])
          }}
        >
          {({ getRootProps, getInputProps }) => (
            <UploadImageWrapper
              hasUploadedImg={hasUploadedImg}
              onMouseEnter={this.toggleImageOverlay}
              onMouseLeave={this.toggleImageOverlay}
              {...getRootProps()}
            >
              {/* {hasUploadedImg &&
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
                })} */}

              {fileToUpload && this.renderImage(fileToUpload)}

              <input {...getInputProps()} />

              {!hasUploadedImg && (
                <Button
                  small
                  variant="outline"
                  icon="image"
                  hasText={this.props.hasText}
                >
                  {this.props.multi ? 'Choose Image(s)' : 'Choose Image'}
                </Button>
              )}

              <UploadImageOverlay isHovering={isHovering}>
                {canDelete && fileToUpload && (
                  <AlignCenterWrapper>
                    <Button
                      small
                      variant="outline"
                      icon="delete"
                      onClick={event => {
                        // Stop it firing the dropzone dialog
                        event.stopPropagation()

                        if (this.props.onDelete) {
                          this.props.onDelete(fileToUpload)
                        }

                        this.setState({
                          fileToUpload: null,
                          isHovering: false,
                        })
                      }}
                      hasText={this.props.hasText}
                    >
                      Delete
                    </Button>
                  </AlignCenterWrapper>
                )}

                {!canDelete && (
                  <Button
                    small
                    variant="outline"
                    icon="image"
                    hasText={this.props.hasText}
                  >
                    Replace image
                  </Button>
                )}
              </UploadImageOverlay>
            </UploadImageWrapper>
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
