import * as React from 'react'
import { Box, Image } from 'rebass'
import styled from '@emotion/styled'
import { Button } from 'oa-components'
import 'react-image-lightbox/style.css'
import { ImageConverter } from './ImageConverter'
import theme from '../../themes/styled.theme'
import Dropzone from 'react-dropzone'
import type { IUploadedFileMeta } from '../../stores/storage'
import { IConvertedFileMeta } from 'src/types'

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
// any export to fix: https://github.com/microsoft/TypeScript/issues/37597
const ImageInputWrapper = styled(AlignCenterWrapper as any)<ITitleProps>`
  position: relative;
  height: 100%;
  width: 100%;
  border: ${props =>
    props.hasUploadedImg ? 0 : `2px dashed ${theme.colors.background}`};
  border-radius: ${theme.space[1]}px;
  background-color: ${theme.colors.white};
  cursor: pointer;
`

const UploadImageOverlay = styled(AlignCenterWrapper as any)`
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
// Input can either come from uploaded or local converted meta
type IInputValue = IUploadedFileMeta | IUploadedFileMeta
type IMultipleInputValue = (IConvertedFileMeta | IUploadedFileMeta)[]

interface IProps {
  // if multiple sends array, otherwise single object (or null on delete)
  onFilesChange: (
    fileMeta: IConvertedFileMeta[] | IConvertedFileMeta | null,
  ) => void
  // TODO - add preview method for case when multiple images uploaded (if being used)
  value?: IInputValue | IMultipleInputValue
  hasText?: boolean
  multiple?: boolean
}
const defaultProps: IProps = {
  onFilesChange: () => null,
  multiple: false,
}

interface IState {
  convertedFiles: IConvertedFileMeta[]
  uploadedFiles: IUploadedFileMeta[]
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
      uploadedFiles: this._getUploadedFiles(props.value),
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

  /**
   * As input can be both array or single object and either uploaded or converted meta,
   * require extra function to separate out to handle preview of previously uploaded
   */
  private _getUploadedFiles(value: IProps['value'] = []) {
    const valArray = Array.isArray(value) ? value : [value]
    return valArray.filter(v =>
      v.hasOwnProperty('downloadUrl'),
    ) as IUploadedFileMeta[]
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
    // TODO - handle case where a server image is deleted (remove from server)
    event.stopPropagation()
    this.setState({
      inputFiles: [],
      convertedFiles: [],
      uploadedFiles: [],
    })
    this.props.onFilesChange(null)
  }

  render() {
    const { inputFiles, uploadedFiles } = this.state
    const { multiple } = this.props
    const showUploadedImg = uploadedFiles.length > 0
    const hasImages = uploadedFiles.length > 0 || inputFiles.length > 0
    return (
      <Box p={0} height="100%">
        <Dropzone
          accept="image/*"
          multiple={multiple}
          onDrop={this.handleFileUpload}
        >
          {({ getRootProps, getInputProps }) => (
            <ImageInputWrapper
              hasUploadedImg={showUploadedImg}
              {...getRootProps()}
            >
              <input {...getInputProps()} />

              {showUploadedImg && <Image src={uploadedFiles[0].downloadUrl} />}

              {!showUploadedImg &&
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
              {!hasImages && (
                <Button small variant="outline" icon="image">
                  Upload Image
                </Button>
              )}

              {hasImages && (
                <UploadImageOverlay>
                  <Button
                    data-cy="delete-image"
                    small
                    variant="outline"
                    icon="delete"
                    onClick={event => this.handleImageDelete(event)}
                  >
                    Delete
                  </Button>
                </UploadImageOverlay>
              )}
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
