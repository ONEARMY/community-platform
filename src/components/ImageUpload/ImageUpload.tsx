import * as React from 'react'
import { BoxContainer } from '../Layout/BoxContainer'
import * as clientCompress from 'client-compress'
import { Button } from '../Button'
import { FlexContainer } from '../Layout/FlexContainer'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'

/*
    This component takes an image through drag/drop or using filepicker, offers resize and upload to firebase
    Note, typings not available for client-compress so find full options here:
    https://github.com/davejm/client-compress
*/

interface IProps {
  test?: 'hello'
}

type ImageQualities = 'normal' | 'high' | 'low'
const imageSizes = {
  low: 640,
  normal: 1280,
  high: 1920,
}
interface IConvertedFileMeta {
  startSize: string
  endSize: string
  compressionPercent: number
  photoData: Blob
  objectUrl: string
  name: string
}

interface IState {
  imageQuality: ImageQualities
  convertedFiles: IConvertedFileMeta[]
  openLightbox?: boolean
}

export class ImageUpload extends React.Component<IProps, IState> {
  private uploadRef = React.createRef<HTMLInputElement>()
  private compressionOptions = {
    quality: 0.75,
    maxWidth: imageSizes.normal,
  }
  private compress: clientCompress = new clientCompress(this.compressionOptions)

  constructor(props: IProps) {
    super(props)
    this.state = { imageQuality: 'normal', convertedFiles: [] }
  }
  get uploadedFiles() {
    const upload = this.uploadRef.current as HTMLInputElement
    return upload.files
  }

  async setImageQuality(quality: ImageQualities) {
    this.setState({
      imageQuality: quality,
    })
    this.compressionOptions.maxWidth = imageSizes[quality]
    this.compress = new clientCompress(this.compressionOptions)
    await this.compressFiles(this.uploadedFiles as FileList)
  }

  componentDidMount() {
    const upload = this.uploadRef.current as HTMLInputElement
    console.log('ref', upload)
    upload.addEventListener(
      'change',
      e => {
        if (this.uploadedFiles) {
          this.compressFiles(this.uploadedFiles)
        }
      },
      false,
    )
  }
  componentWillUnmount() {
    // Revoke the object URL to free up memory
    this.state.convertedFiles.forEach(file => {
      URL.revokeObjectURL(file.objectUrl)
    })
  }

  private _generateFileMeta(c: ICompressedOutput) {
    const meta: IConvertedFileMeta = {
      name: c.photo.name,
      startSize: this.bytesToSize(c.info.startSizeMB * 1000 * 1000),
      endSize: this.bytesToSize(c.info.endSizeMB * 1000 * 1000),
      compressionPercent: Number(c.info.sizeReducedInPercent.toFixed(1)),
      photoData: c.photo.data,
      objectUrl: URL.createObjectURL(c.photo.data),
    }
    return meta
  }

  async compressFiles(files: FileList) {
    const allFiles = [].slice.call(files)

    const conversions: ICompressedOutput[] = await this.compress.compress(
      allFiles,
    )
    const convertedMeta = conversions.map(c => this._generateFileMeta(c))
    this.setState({
      convertedFiles: convertedMeta,
    })
  }

  bytesToSize(bytes: number) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) {
      return '0 Byte'
    }
    const i = Number(Math.floor(Math.log(bytes) / Math.log(1024)))
    const size = (bytes / Math.pow(1024, i)).toPrecision(3) + ' ' + sizes[i]
    return size
  }

  render() {
    const { convertedFiles, imageQuality, openLightbox } = this.state
    const qualities: ImageQualities[] = ['low', 'normal', 'high']
    return (
      <BoxContainer width="300px">
        <>
          <div>Image Upload</div>
          <input type="file" name="pic" accept="image/*" ref={this.uploadRef} />
          {convertedFiles.map(file => {
            return (
              <div key={file.name}>
                <img
                  style={{ width: '400px' }}
                  alt=""
                  id="preview"
                  src={file.objectUrl}
                  onClick={() => this.setState({ openLightbox: true })}
                />
                <div>
                  {file.startSize} -> {file.endSize}
                </div>
                <div>({file.compressionPercent}% reduced)</div>
              </div>
            )
          })}
          {openLightbox && (
            <Lightbox
              mainSrc={convertedFiles[0].objectUrl}
              onCloseRequest={() => this.setState({ openLightbox: false })}
            />
          )}
          <FlexContainer>
            {convertedFiles.length > 0 &&
              qualities.map(quality => (
                <Button
                  variant={imageQuality === quality ? 'dark' : 'outline'}
                  key={quality}
                  onClick={() => this.setImageQuality(quality)}
                >
                  {quality}
                </Button>
              ))}
          </FlexContainer>
        </>
      </BoxContainer>
    )
  }
}

/************************************************************************************
 *    Interfaces
 *
 *************************************************************************************/

type imageFormats = 'image/jpeg' | 'image/jpg' | 'image/gif' | 'image/png'
// NOTE - gifs will lose animation and png will lost transparency
// Additional types: image/bmp, image/tiff, image/x-icon,  image/svg+xml, image/webp, image/xxx

interface ICompressedOutput {
  photo: ICompressedPhoto
  info: ICompressedInfo
}

interface ICompressedPhoto {
  name: string
  type: 'image/jpeg' | string
  size: number // in bytes,
  orientation: -1
  data: Blob
  width: number
  height: number
}
// This is the metadata for this conversion
interface ICompressedInfo {
  start: number
  quality: number
  startType: 'image/jpeg'
  startWidth: number
  startHeight: number
  endWidth: number
  endHeight: number
  iterations: number
  startSizeMB: number
  endSizeMB: number
  sizeReducedInPercent: number
  end: number
  elapsedTimeInSeconds: number
  endType: 'image/jpeg'
}
