import { useEffect, useState } from 'react'
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

const _generateFileMeta = (c: File) => {
  const meta: IConvertedFileMeta = {
    name: addTimestampToFileName(c.name),
    photoData: c,
    objectUrl: URL.createObjectURL(c),
    type: c.type,
  }
  return meta
}

export const ImageConverter = (props: IProps) => {
  const [state, setState] = useState<IState>({})
  const { convertedFile } = state

  useEffect(() => {
    compressFiles(props.file)

    return () => {
      if (state.convertedFile) {
        URL.revokeObjectURL(state.convertedFile.objectUrl)
      }
    }
  }, [])

  const compressFiles = async (file: File) => {
    // by default compress takes an array and gives back an array. We only want to handle a single image
    const convertedMeta = _generateFileMeta(file)
    setState((state) => ({
      ...state,
      convertedFile: convertedMeta,
    }))
    props.onImgConverted(convertedMeta)
  }

  if (!convertedFile) {
    return null
  }

  return (
    <Flex
      style={{
        backgroundImage: `url("${convertedFile.objectUrl}")`,
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
      onClick={() => props.onImgClicked(convertedFile)}
    />
  )
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
