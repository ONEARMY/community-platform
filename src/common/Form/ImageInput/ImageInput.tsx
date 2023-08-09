import * as React from 'react'
import type { BoxProps, ThemeUIStyleObject } from 'theme-ui'
import { Box, Flex, Image } from 'theme-ui'
import { Button } from 'oa-components'
import 'react-image-lightbox/style.css'
import { ImageConverter } from './ImageConverter'
import Dropzone from 'react-dropzone'
import type { IUploadedFileMeta } from '../../../stores/storage'
import type { IConvertedFileMeta } from 'src/types'

interface ITitleProps {
  hasUploadedImg: boolean
}

const alignCenterWrapperStyles: ThemeUIStyleObject = {
  height: '100%',
  width: '100%',
  overflow: 'hidden',
  justifyContent: 'center',
  alignItems: 'center',
}

// any export to fix: https://github.com/microsoft/TypeScript/issues/37597
const ImageInputWrapper = React.forwardRef<HTMLElement, BoxProps & ITitleProps>(
  (props, ref): JSX.Element => {
    const { hasUploadedImg, ...rest } = props
    return (
      <Flex
        ref={ref}
        sx={{
          ...alignCenterWrapperStyles,
          position: 'relative',
          borderColor: 'background',
          borderStyle: hasUploadedImg ? 'none' : 'dashed',
          borderRadius: 1,
          backgroundColor: 'white',
        }}
        {...rest}
      >
        {props.children}
      </Flex>
    )
  },
)

ImageInputWrapper.displayName = 'ImageInputWrapper'

const UploadImageOverlay = (props: BoxProps): JSX.Element => (
  <Flex
    sx={{
      ...alignCenterWrapperStyles,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      opacity: 0,
      visibility: 'hidden',
      transition: 'opacity 300ms ease-in',
      borderRadius: 1,
      '.image-input__wrapper:hover &': {
        visibility: 'visible',
        opacity: 1,
      },
    }}
  >
    {props.children}
  </Flex>
)

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

  public handleFileUpload = (filesToUpload: Array<File>) => {
    this.setState({ inputFiles: filesToUpload })
  }
  constructor(props: IProps) {
    super(props)
    this.state = {
      inputFiles: [],
      convertedFiles: [],
      uploadedFiles: this._getUploadedFiles(props.value),
    }
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
    // TODO - handle case where a server image is deleted (remove from server)
    event.stopPropagation()
    this.setState({
      inputFiles: [],
      convertedFiles: [],
      uploadedFiles: [],
    })
    this.props.onFilesChange(null)
  }

  componentDidUpdate(previousProps): void {
    if (
      JSON.stringify(this.props.value) !== JSON.stringify(previousProps.value)
    ) {
      this.setState({
        uploadedFiles: this._getUploadedFiles(this.props.value),
      })
    }
  }

  render() {
    const { inputFiles, uploadedFiles } = this.state
    const { multiple } = this.props
    const showUploadedImg = uploadedFiles.length > 0
    const hasImages = uploadedFiles.length > 0 || inputFiles.length > 0
    return (
      <Box p={0} sx={{ height: '100%' }}>
        <Dropzone
          accept="image/*"
          multiple={multiple}
          onDrop={this.handleFileUpload}
        >
          {({ getRootProps, getInputProps, rootRef }) => (
            <ImageInputWrapper
              ref={rootRef}
              className={'image-input__wrapper'}
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
                      onImgConverted={(meta) =>
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
                    variant="secondary"
                    icon="delete"
                    onClick={(event) => this.handleImageDelete(event)}
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
  /**
   * As input can be both array or single object and either uploaded or converted meta,
   * require extra function to separate out to handle preview of previously uploaded
   */
  private _getUploadedFiles(value: IProps['value'] = []) {
    const valArray = Array.isArray(value) ? value : [value]
    return valArray.filter((v) =>
      Object.prototype.hasOwnProperty.call(v, 'downloadUrl'),
    ) as IUploadedFileMeta[]
  }
}
