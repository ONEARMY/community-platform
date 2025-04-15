import { useEffect, useRef, useState } from 'react'
import Dropzone from 'react-dropzone-esm'
import { Box, Flex, Image, Text } from 'theme-ui'

import { Button } from '../Button/Button'
import { Modal } from '../Modal/Modal'
import { compressImage } from './compressImage'
import { getPresentFiles } from './getPresentFiles'
import { ImageConverterList } from './ImageConverterList'
import { ImageInputDeleteImage } from './ImageInputDeleteImage'
import { ImageInputWrapper } from './ImageInputWrapper'
import { imageValid } from './imageValid'
import { setSrc } from './setSrc'

import type { IConvertedFileMeta } from 'oa-shared'
import type { ThemeUIStyleObject } from 'theme-ui'
import type {
  IFileMeta,
  IInputValue,
  IMultipleInputValue,
  IValue,
} from './types'

interface IProps {
  onFilesChange: (fileMeta: IFileMeta) => void
  imageDisplaySx?: ThemeUIStyleObject | undefined
  value?: IValue
  hasText?: boolean
  dataTestId?: string
}

export const ImageInput = (props: IProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const prevPropsValue = useRef<IInputValue | IMultipleInputValue>()

  const { dataTestId, imageDisplaySx, onFilesChange, value } = props

  const [inputFiles, setInputFiles] = useState<File[]>([])
  const [convertedFiles, setConvertedFiles] = useState<IConvertedFileMeta[]>([])
  const [presentFiles, setPresentFiles] = useState<IMultipleInputValue>(
    getPresentFiles(value),
  )
  const [isImageCorrupt, setIsImageCorrupt] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)

  const onDrop = async (selectedImage: File[]) => {
    try {
      await imageValid(selectedImage[0])
      setIsImageCorrupt(false)

      try {
        const compressedImage = await compressImage(selectedImage[0])
        selectedImage[0] = compressedImage
      } catch (compressionError) {
        console.error(
          'Image compression failed, using original image: ',
          compressionError,
        )
      }

      setInputFiles(selectedImage)
    } catch (validationError) {
      setIsImageCorrupt(true)
      setShowErrorModal(true)
    }
  }

  const handleConvertedFileChange = (
    newFile: IConvertedFileMeta,
    index: number,
  ) => {
    const nextFiles = convertedFiles
    nextFiles[index] = newFile
    setConvertedFiles(convertedFiles)

    props.onFilesChange(convertedFiles[0])
  }

  const handleImageDelete = (event: Event) => {
    // TODO - handle case where a server image is deleted (remove from server)
    event.stopPropagation()
    setInputFiles([])
    setConvertedFiles([])
    setPresentFiles([])
    onFilesChange(null)
  }

  useEffect(() => {
    if (JSON.stringify(value) !== JSON.stringify(prevPropsValue.current)) {
      setPresentFiles(getPresentFiles(value))
    }

    prevPropsValue.current = value
  }, [props])

  const hasImages = presentFiles.length > 0 || inputFiles.length > 0
  const showUploadedImg = presentFiles.length > 0
  const src = setSrc(presentFiles[0])

  return (
    <Box p={0} sx={imageDisplaySx ? imageDisplaySx : { height: '100%' }}>
      <Dropzone
        accept={{
          'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.svg', '.webp'],
        }}
        multiple={false}
        onDrop={onDrop}
      >
        {({ getRootProps, getInputProps, rootRef }) => (
          <ImageInputWrapper
            {...getRootProps()}
            ref={rootRef}
            hasUploadedImg={showUploadedImg}
          >
            <input
              ref={fileInputRef}
              data-testid={dataTestId || 'image-input'}
              {...getInputProps()}
            />

            {showUploadedImg && <Image src={src} sx={imageDisplaySx} />}

            {!showUploadedImg && (
              <ImageConverterList
                inputFiles={inputFiles}
                handleConvertedFileChange={handleConvertedFileChange}
              />
            )}
            {!hasImages && (
              <Button small variant="outline" icon="image" type="button">
                Upload
              </Button>
            )}
            {hasImages && (
              <ImageInputDeleteImage
                onClick={(event) => handleImageDelete(event)}
              />
            )}
          </ImageInputWrapper>
        )}
      </Dropzone>
      <Modal
        width={600}
        isOpen={showErrorModal}
        onDidDismiss={() => setShowErrorModal(false)}
      >
        {isImageCorrupt && (
          <Flex
            data-cy="ImageUploadError"
            mt={[1, 1, 1]}
            sx={{
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '20px',
            }}
          >
            <Text>
              The uploaded image appears to be corrupted or a type we don't
              accept.
            </Text>
            <Text>
              Check your image is valid and one of the following formats: jpeg,
              jpg, png, gif, heic, svg or webp.
            </Text>
            <Button
              data-cy="ImageUploadError-Button"
              sx={{ marginTop: '20px', justifyContent: 'center' }}
              onClick={() => setShowErrorModal(false)}
            >
              Try uploading something else
            </Button>
          </Flex>
        )}
      </Modal>
    </Box>
  )
}
