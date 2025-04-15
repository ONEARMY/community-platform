import { ImageConverter } from './ImageConverter'

import type { IConvertedFileMeta } from 'oa-shared'

interface IProps {
  inputFiles: File[]
  handleConvertedFileChange: (meta: IConvertedFileMeta, index: number) => void
}

export const ImageConverterList = (props: IProps) => {
  const { inputFiles, handleConvertedFileChange } = props

  return (
    <>
      {inputFiles.map((file, index) => {
        return (
          <ImageConverter
            key={file.name}
            file={file}
            onImgConverted={(meta) => handleConvertedFileChange(meta, index)}
          />
        )
      })}
    </>
  )
}
