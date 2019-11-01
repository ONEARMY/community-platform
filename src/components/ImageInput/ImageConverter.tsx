import * as React from 'react'
import { Flex, Box } from 'rebass'
import { Button } from '../Button'
import * as clientCompress from 'client-compress'
import { IConvertedFileMeta, bytesToSize } from './ImageInput'
import styled from 'styled-components'

interface IProps {
  file: File
  onImgConverted: (meta: IConvertedFileMeta) => void
  onImgClicked: (meta: IConvertedFileMeta) => void
}
interface IState {
  compressionOptions: ICompressionOptions
  convertedFile?: IConvertedFileMeta
  openLightbox?: boolean
}

const imageSizes = {
  low: 640,
  normal: 1280,
  high: 1920,
}

const PreviewImage = styled(Flex)`
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
  border-radius: 5px;
  border: 1px solid #ececec;
`

export class ImageConverter extends React.Component<IProps, IState> {
  public static defaultProps: Partial<IProps>

  constructor(props: IProps) {
    super(props)
    this.state = {
      compressionOptions: {
        maxWidth: imageSizes.normal,
        quality: 0.75,
      },
    } as IState
  }

  async componentDidMount() {
    // call on mount to trigger initial conversion when converter created
    await this.compressFiles(this.props.file)
  }

  componentWillUnmount() {
    // Revoke the object URL to free up memory
    if (this.state.convertedFile) {
      URL.revokeObjectURL(this.state.convertedFile.objectUrl)
    }
  }

  async compressFiles(file: File) {
    const { compressionOptions } = this.state
    const compressor: clientCompress = new clientCompress(compressionOptions)

    // by default compress takes an array and gives back an array. We only want to handle a single image
    const conversion: ICompressedOutput[] = await compressor.compress([file])
    const convertedMeta = this._generateFileMeta(conversion[0])
    this.setState({
      convertedFile: convertedMeta,
    })
    this.props.onImgConverted(convertedMeta)
  }

  private _generateFileMeta(c: ICompressedOutput) {
    const meta: IConvertedFileMeta = {
      name: c.photo.name,
      startSize: bytesToSize(c.info.startSizeMB * 1000 * 1000),
      endSize: bytesToSize(c.info.endSizeMB * 1000 * 1000),
      compressionPercent: Number(c.info.sizeReducedInPercent.toFixed(1)),
      photoData: c.photo.data,
      objectUrl: URL.createObjectURL(c.photo.data),
      type: c.photo.type,
    }
    return meta
  }

  render() {
    const { convertedFile } = this.state

    if (!convertedFile) {
      return null
    }

    return (
      <PreviewImage
        style={{
          backgroundImage: `url(${convertedFile.objectUrl})`,
        }}
        id="preview"
        onClick={() => this.props.onImgClicked(convertedFile)}
      />
    )
  }
}
ImageConverter.defaultProps = {
  onImgClicked: () => null,
}

/************************************************************************************
 *    Interfaces
 *
 *************************************************************************************/

interface ICompressedOutput {
  photo: ICompressedPhoto
  info: ICompressedInfo
}

interface ICompressionOptions {
  quality: number
  maxWidth: number
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

type imageFormats = 'image/jpeg' | 'image/jpg' | 'image/gif' | 'image/png'
// NOTE - gifs will lose animation and png will lost transparency
// Additional types: image/bmp, image/tiff, image/x-icon,  image/svg+xml, image/webp, image/xxx
