import * as React from 'react'
import { Box, Flex } from 'rebass'
import { Button } from '../Button'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'
import Dropzone from 'react-dropzone'
import theme from 'src/themes/styled.theme'
import { ImageConverter } from './ImageConverter'

import styled from 'styled-components'

interface IUploadImageOverlayIProps {
  isHovering: boolean
}

interface ITitleProps {
  readonly onMouseEnter: object | null
  hasImage: boolean
}

/*
    This component takes multiple imageusing filepicker and resized clientside
    Note, typings not available for client-compress so find full options here:
    https://github.com/davejm/client-compress
*/

interface IProps {
  onFilesChange?: (fileMeta: IConvertedFileMeta[]) => void
  multi?: boolean
  canDelete?: boolean
  hasText?: boolean
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

const UploadImageWrapper = styled.div<ITitleProps>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  /* width: 100%;
  min-height: 230px;
  height: 230px; */
  height: 100%;
  width: 100%;
  border: 2px dashed ${theme.colors.lightGrey};
  border-radius: ${theme.space[1]}px;
  background-color: ${theme.colors.white};

  ${props =>
    props.hasImage &&
    `
    border: none;
  `}
`

const UploadImageOverlay = styled.div<IUploadImageOverlayIProps>`
  position: absolute;
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
  // private fileInputRef = React.createRef<HTMLInputElement>()

  constructor(props: IProps) {
    super(props)
    this.state = {
      inputFiles: [],
      convertedFiles: [],
      isHovering: false,
    }
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

  public toggleImageOverlay = () => {
    const { inputFiles } = this.state
    if (inputFiles && inputFiles.length === 0) {
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
    const { canDelete } = this.props
    // if at least one image present, hide the 'choose image' button and replace with smaller button
    const imgPreviewMode = inputFiles.length > 0

    const hasImage = inputFiles && inputFiles.length > 0

    return (
      <Box p={0} style={{ height: '100%' }}>
        <UploadImageWrapper
          hasImage={hasImage}
          onMouseEnter={this.toggleImageOverlay}
          onMouseLeave={this.toggleImageOverlay}
        >
          {inputFiles.length === 0 && (
            <Dropzone
              multiple={false}
              onDrop={filesToUpload => {
                const files = filesToUpload ? Array.from(filesToUpload) : []

                this.setState({ inputFiles: files })
              }}
            >
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <Button
                    small
                    variant="outline"
                    icon="image"
                    hasText={this.props.hasText}
                  >
                    {this.props.multi ? 'Choose Image(s)' : 'Choose Image'}
                  </Button>
                </div>
              )}
            </Dropzone>
          )}

          {hasImage &&
            inputFiles.map((file, index) => {
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

          <UploadImageOverlay isHovering={isHovering}>
            {!canDelete ? (
              <Dropzone
                multiple={false}
                onDrop={filesToUpload => {
                  console.log(filesToUpload)
                  const files = filesToUpload ? Array.from(filesToUpload) : []

                  this.setState({ inputFiles: files })
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <div
                    style={{
                      display: 'flex',
                      height: '100%',
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    {...getRootProps()}
                  >
                    <input {...getInputProps()} />
                    <Button
                      small
                      variant="outline"
                      icon="image"
                      hasText={this.props.hasText}
                    >
                      Replace image
                    </Button>
                  </div>
                )}
              </Dropzone>
            ) : (
              <div
                style={{
                  display: 'flex',
                  height: '100%',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Button
                  small
                  variant="outline"
                  icon="delete"
                  onClick={() =>
                    this.setState({
                      inputFiles: [],
                      isHovering: false,
                    })
                  }
                  hasText={this.props.hasText}
                >
                  Delete
                </Button>
              </div>
            )}
          </UploadImageOverlay>
        </UploadImageWrapper>

        {openLightbox && (
          <Lightbox
            mainSrc={lightboxImg!.objectUrl}
            onCloseRequest={() => this.setState({ openLightbox: false })}
          />
        )}
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
