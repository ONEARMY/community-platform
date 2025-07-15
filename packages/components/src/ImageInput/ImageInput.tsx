import { useEffect, useRef, useState } from 'react'
import Dropzone from 'react-dropzone-esm'
import { Box, Flex, Image as ImageComponent, Text } from 'theme-ui'

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

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB in bytes
const MAX_IMAGE_DIMENSION = 2500 // 2500px max width/height

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
  const [isImageTooLarge, setIsImageTooLarge] = useState(false)
  const [isImageDimensionsTooLarge, setIsImageDimensionsTooLarge] =
    useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)

  const checkImageDimensions = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        if (
          img.width > MAX_IMAGE_DIMENSION ||
          img.height > MAX_IMAGE_DIMENSION
        ) {
          reject(
            new Error(`Image dimensions too large: ${img.width}x${img.height}`),
          )
        } else {
          resolve()
        }
      }
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    })
  }

  const onDrop = async (selectedImage: File[]) => {
    try {
      // Check file size first
      if (selectedImage[0].size > MAX_FILE_SIZE) {
        setIsImageTooLarge(true)
        setIsImageCorrupt(false)
        setIsImageDimensionsTooLarge(false)
        setShowErrorModal(true)
        return
      }

      // Check image dimensions
      try {
        await checkImageDimensions(selectedImage[0])
      } catch (dimensionError) {
        setIsImageDimensionsTooLarge(true)
        setIsImageCorrupt(false)
        setIsImageTooLarge(false)
        setShowErrorModal(true)
        return
      }

      await imageValid(selectedImage[0])
      setIsImageCorrupt(false)
      setIsImageTooLarge(false)
      setIsImageDimensionsTooLarge(false)

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
      setIsImageTooLarge(false)
      setIsImageDimensionsTooLarge(false)
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

            {showUploadedImg && (
              <ImageComponent src={src} sx={imageDisplaySx} />
            )}

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
        {isImageDimensionsTooLarge && (
          <Flex
            data-cy="ImageUploadDimensionsError"
            mt={[1, 1, 1]}
            sx={{
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '20px',
            }}
          >
            <Text>
              The uploaded image dimensions are too large. Maximum width and
              height is 2500px.
            </Text>
            <Text>
              Please resize your image or choose one with smaller dimensions.
            </Text>
            <Button
              data-cy="ImageUploadDimensionsError-Button"
              sx={{ marginTop: '20px', justifyContent: 'center' }}
              onClick={() => setShowErrorModal(false)}
            >
              Try uploading something else
            </Button>
          </Flex>
        )}
        {isImageTooLarge && (
          <Flex
            data-cy="ImageUploadSizeError"
            mt={[1, 1, 1]}
            sx={{
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '20px',
            }}
          >
            <Text>
              The uploaded image is too large. Maximum file size is 5MB.
            </Text>
            <Text>Please compress your image or choose a smaller file.</Text>
            <Button
              data-cy="ImageUploadSizeError-Button"
              sx={{ marginTop: '20px', justifyContent: 'center' }}
              onClick={() => setShowErrorModal(false)}
            >
              Try uploading something else
            </Button>
          </Flex>
        )}
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
