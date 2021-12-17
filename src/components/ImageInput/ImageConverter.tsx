import * as React from 'react'
import { Flex } from 'rebass/styled-components'
import imageCompression from 'browser-image-compression'
import { IConvertedFileMeta } from './ImageInput'
import styled from 'styled-components'
import theme from '../../themes/styled.theme'

interface IProps {
  file: File
  onImgConverted: (meta: IConvertedFileMeta) => void
  onImgClicked: (meta: IConvertedFileMeta) => void
}
interface IState {
  compressionOptions: Parameters<typeof imageCompression>[1]
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
  border: 1px solid ${theme.colors.offwhite};
`

export class ImageConverter extends React.Component<IProps, IState> {
  public static defaultProps: Partial<IProps>

  constructor(props: IProps) {
    super(props)
    this.state = {
      compressionOptions: {
        maxWidthOrHeight: imageSizes.normal,
        initialQuality: 0.75,
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

    // by default compress takes an array and gives back an array. We only want to handle a single image
    const conversion: File = await imageCompression(file, compressionOptions)
    const convertedMeta = this._generateFileMeta(conversion)
    this.setState({
      convertedFile: convertedMeta,
    })
    this.props.onImgConverted(convertedMeta)
  }

  private _generateFileMeta(c: File) {
    const meta: IConvertedFileMeta = {
      name: c.name,
      photoData: c,
      objectUrl: URL.createObjectURL(c),
      type: c.type,
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