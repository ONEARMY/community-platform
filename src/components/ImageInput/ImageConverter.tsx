import * as React from 'react'
import { Flex, Box } from 'rebass'
import { Button } from '../Button'
import * as clientCompress from 'client-compress'
import { IConvertedFileMeta, bytesToSize } from './ImageInput'
import Text from '../Text'

interface IProps {
  file: File
  onImgConverted: (meta: IConvertedFileMeta) => void
  onImgClicked: (meta: IConvertedFileMeta) => void
}
interface IState {
  imageQuality: ImageQualities
  convertedFile?: IConvertedFileMeta
  openLightbox?: boolean
}

type ImageQualities = 'normal' | 'high' | 'low'
const imageSizes = {
  low: 640,
  normal: 1280,
  high: 1920,
}

export class ImageConverter extends React.Component<IProps, IState> {
  public static defaultProps: Partial<IProps>
  private compressionOptions = {
    quality: 0.75,
    maxWidth: imageSizes.normal,
  }
  private compress: clientCompress = new clientCompress(this.compressionOptions)

  constructor(props: IProps) {
    super(props)
    this.state = { imageQuality: 'normal' }
  }

  componentDidMount() {
    // call on mount to trigger initial conversion when converter created
    this.setImageQuality('normal')
  }

  componentWillUnmount() {
    // Revoke the object URL to free up memory
    if (this.state.convertedFile) {
      URL.revokeObjectURL(this.state.convertedFile.objectUrl)
    }
  }

  async setImageQuality(quality: ImageQualities) {
    this.setState({
      imageQuality: quality,
    })
    this.compressionOptions.maxWidth = imageSizes[quality]
    this.compress = new clientCompress(this.compressionOptions)
    await this.compressFiles(this.props.file)
  }

  async compressFiles(file: File) {
    // by default compress takes an array and gives back an array. We only want to handle a single image
    const conversion: ICompressedOutput[] = await this.compress.compress([file])
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
    const { convertedFile, imageQuality } = this.state
    const qualities: ImageQualities[] = ['low', 'normal', 'high']

    return convertedFile ? (
      <Box>
        <Box
          style={{
            backgroundImage: `url(${convertedFile.objectUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height: '220px',
            border: '1px solid #dddddd',
          }}
          id="preview"
          onClick={() => this.props.onImgClicked(convertedFile)}
        />
        <Box>
          <Flex p={0} bg="none" mt={2} mb={2}>
            {convertedFile &&
              qualities.map(quality => (
                <Button
                  variant={imageQuality === quality ? 'dark' : 'outline'}
                  key={quality}
                  onClick={() => this.setImageQuality(quality)}
                >
                  {quality}
                </Button>
              ))}
          </Flex>
          <Box>
            {convertedFile.startSize} -> {convertedFile.endSize}
          </Box>
          <Text small>{convertedFile.compressionPercent}% smaller 🌍</Text>
        </Box>
      </Box>
    ) : null
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
