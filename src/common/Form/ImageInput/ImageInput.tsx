import { useEffect, useRef, useState } from 'react'
import Dropzone from 'react-dropzone'
import { Button } from 'oa-components'
import { Box, Image } from 'theme-ui'

import { DeleteImage } from './DeleteImage'
import { getPresentFiles } from './getPresentFiles'
import { ImageConverterList } from './ImageConverterList'
import { ImageInputWrapper } from './ImageInputWrapper'
import { setSrc } from './setSrc'

import type { IConvertedFileMeta } from 'src/types'
import type { IUploadedFileMeta } from '../../../stores/storage'

/*
    This component takes multiple image using filepicker and resized clientside
    Note, typings not available for client-compress so find full options here:
    https://github.com/davejm/client-compress
*/
// Input can either come from uploaded or local converted meta
export type IInputValue = IUploadedFileMeta | IConvertedFileMeta
export type IMultipleInputValue = IInputValue[]
export type IValue = IInputValue | IMultipleInputValue

interface IProps {
  onFilesChange: (
    fileMeta: IConvertedFileMeta[] | IConvertedFileMeta | null,
  ) => void
  value?: IValue
  hasText?: boolean
  multiple?: boolean
  dataTestId?: string
}

export const ImageInput = (props: IProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const prevPropsValue = useRef<IInputValue | IMultipleInputValue>()

  const { dataTestId, multiple, value } = props
  const [inputFiles, setInputFiles] = useState<File[]>([])
  const [convertedFiles, setConvertedFiles] = useState<IConvertedFileMeta[]>([])
  const [presentFiles, setPresentFiles] = useState<IMultipleInputValue>(
    getPresentFiles(value),
  )

  const onDrop = (inputFiles) => {
    setInputFiles(inputFiles)
  }

  const handleConvertedFileChange = (newFile, index) => {
    const nextFiles = convertedFiles.map((file, i) => {
      return i === index ? newFile : file
    })

    setConvertedFiles(nextFiles)

    const value = props.multiple ? convertedFiles : convertedFiles[0]
    props.onFilesChange(value)
  }

  const handleImageDelete = (event: Event) => {
    // TODO - handle case where a server image is deleted (remove from server)
    event.stopPropagation()
    setInputFiles([])
    setConvertedFiles([])
    setPresentFiles([])
    props.onFilesChange(null)
  }

  useEffect(() => {
    if (
      JSON.stringify(props.value) !== JSON.stringify(prevPropsValue.current)
    ) {
      setPresentFiles(getPresentFiles(props.value))
    }

    prevPropsValue.current = props.value
  }, [props])

  const hasImages = presentFiles.length > 0 || inputFiles.length > 0
  const showUploadedImg = presentFiles.length > 0
  const src = setSrc(presentFiles[0])

  return (
    <Box p={0} sx={{ height: '100%' }}>
      <Dropzone accept="image/*" multiple={multiple} onDrop={onDrop}>
        {({ getRootProps, getInputProps, rootRef }) => (
          <ImageInputWrapper
            ref={rootRef}
            hasUploadedImg={showUploadedImg}
            {...getRootProps()}
          >
            <input
              ref={fileInputRef}
              data-testid={dataTestId || 'image-input'}
              {...getInputProps()}
            />

            {showUploadedImg && <Image src={src} />}

            {!showUploadedImg && (
              <ImageConverterList
                inputFiles={inputFiles}
                handleConvertedFileChange={handleConvertedFileChange}
              />
            )}

            {!hasImages && (
              <Button small variant="outline" icon="image">
                Upload Image
              </Button>
            )}

            {hasImages && (
              <DeleteImage onClick={(event) => handleImageDelete(event)} />
            )}
          </ImageInputWrapper>
        )}
      </Dropzone>
    </Box>
  )
}
