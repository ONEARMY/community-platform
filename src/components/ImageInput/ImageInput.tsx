import * as React from 'react'
import { Box } from 'rebass'
import { Button } from '../Button'
import Dropzone from 'react-dropzone'
import theme from 'src/themes/styled.theme'
import { ImageConverter } from './ImageConverter'

import styled from 'styled-components'

interface IUploadImageOverlayIProps {
  isHovering: boolean
}

interface ITitleProps {
  readonly onMouseEnter: object | null
  hasUploadedImg: boolean
}

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
  inputFiles: File[]
  isHovering: boolean
}

const AlignCenterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`

const UploadImageWrapper = styled.div<ITitleProps>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
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
  constructor(props: IProps) {
    super(props)
    this.state = {
      inputFiles: [],
      isHovering: false,
    }
  }

  public handleConvertedFileChange(file: IConvertedFileMeta, index: number) {
    if (this.props.onFilesChange) {
      this.props.onFilesChange([file])
    }
  }

  public toggleImageOverlay = () => {
    const { inputFiles } = this.state
    if (inputFiles && inputFiles.length === 0) {
      // If there is no image selected/uploaded
      // Don't toggle it.
      return
    }

    this.setState((prevState: Readonly<IState>) => ({
      isHovering: !prevState.isHovering,
    }))
  }

  render() {
    const { inputFiles, isHovering } = this.state
    const { canDelete } = this.props

    const hasUploadedImg = inputFiles && inputFiles.length > 0

    return (
      <Box p={0} style={{ height: '100%' }}>
        <UploadImageWrapper
          hasUploadedImg={hasUploadedImg}
          onMouseEnter={this.toggleImageOverlay}
          onMouseLeave={this.toggleImageOverlay}
        >
          {inputFiles.length === 0 && (
            <Dropzone
              accept="image/*"
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

          {hasUploadedImg &&
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

          <UploadImageOverlay isHovering={isHovering}>
            {canDelete && (
              <AlignCenterWrapper>
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
              </AlignCenterWrapper>
            )}

            {!canDelete && (
              <Dropzone
                accept="image/*"
                multiple={false}
                onDrop={filesToUpload => {
                  console.log(filesToUpload)
                  const files = filesToUpload ? Array.from(filesToUpload) : []

                  this.setState({ inputFiles: files })
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <AlignCenterWrapper {...getRootProps()}>
                    <input {...getInputProps()} />
                    <Button
                      small
                      variant="outline"
                      icon="image"
                      hasText={this.props.hasText}
                    >
                      Replace image
                    </Button>
                  </AlignCenterWrapper>
                )}
              </Dropzone>
            )}
          </UploadImageOverlay>
        </UploadImageWrapper>
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
