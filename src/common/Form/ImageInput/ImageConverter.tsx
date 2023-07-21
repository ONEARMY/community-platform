import * as React from 'react'
import { Flex } from 'theme-ui'
import type { IConvertedFileMeta } from 'src/types'

interface IProps {
  file: File
  onImgConverted: (meta: IConvertedFileMeta) => void
  onImgClicked: (meta: IConvertedFileMeta) => void
}
interface IState {
  convertedFile?: IConvertedFileMeta
  openLightbox?: boolean
}

export class ImageConverter extends React.Component<IProps, IState> {
  public static defaultProps: Partial<IProps>

  constructor(props: IProps) {
    super(props)
    this.state = {} as IState
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

    const convertedMeta = this._generateFileMeta(file)
    this.setState({
      convertedFile: convertedMeta,
    })
    this.props.onImgConverted(convertedMeta)
  }

  render() {
    const { convertedFile } = this.state

    if (!convertedFile) {
      return null
    }

    return (
      <Flex
        style={{
          backgroundImage: `url(${convertedFile.objectUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          width: '100%',
          height: '100%',
        }}
        sx={{
          border: '1px solid ',
          borderColor: 'offwhite',
          borderRadius: 1,
        }}
        id="preview"
        onClick={() => this.props.onImgClicked(convertedFile)}
      />
    )
  }
  private _generateFileMeta(c: File) {
    const meta: IConvertedFileMeta = {
      name: addTimestampToFileName(c.name),
      photoData: c,
      objectUrl: URL.createObjectURL(c),
      type: c.type,
    }
    return meta
  }
}
ImageConverter.defaultProps = {
  onImgClicked: () => null,
}

/** Insert a base-16 timestamp into a file's name and return it
 */
export const addTimestampToFileName = (str: string): string => {
  // Return early for malformed input type 🙈
  if (typeof str !== 'string') return str

  const indexOfDot = str.lastIndexOf('.')

  // Return early if the filename doesn't contain an extension
  if (indexOfDot <= 0) return str

  // inserts "-[current time in base-16]" right before the file type extension
  return (
    str.slice(0, indexOfDot) +
    '-' +
    Date.now().toString(16) +
    str.slice(indexOfDot)
  )
}
