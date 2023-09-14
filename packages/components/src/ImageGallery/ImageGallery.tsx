import 'react-image-lightbox/style.css'
import { useEffect, useState } from 'react'
import Lightbox from 'react-image-lightbox'
import type { CardProps } from 'theme-ui'
import { Box, Flex, Image } from 'theme-ui'
import styled from '@emotion/styled'

interface IUploadedFileMeta {
  downloadUrl: string
  contentType?: string | null
  fullPath: string
  name: string
  type: string
  size: number
  timeCreated: string
  updated: string
}

export interface IProps {
  images: IUploadedFileMeta[]
  allowPortrait?: boolean
}

interface IState {
  activeImageIndex: number
  showLightbox: boolean
  images: Array<IUploadedFileMeta>
}

const ThumbCard = styled<CardProps & React.ComponentProps<any>>(Box)`
  cursor: pointer;
  padding: 5px;
  overflow: hidden;
  transition: 0.2s ease-in-out;
  &:hover {
    transform: translateY(-5px);
  }
`

export const ImageGallery = (props: IProps) => {
  const [state, setState] = useState<IState>({
    activeImageIndex: 0,
    showLightbox: false,
    images: [],
  })

  useEffect(() => {
    const images = (props.images || []).filter((img) => img !== null)
    setState({
      ...state,
      activeImageIndex: 0,
      images: images,
    })
  }, [])

  const setActive = (imageIndex: number) => {
    setState({
      ...state,
      activeImageIndex: imageIndex,
    })
  }

  const triggerLightbox = (): void =>
    setState(({ showLightbox }) => {
      return {
        ...state,
        showLightbox: !showLightbox,
      }
    })

  const images = state.images
  const activeImageIndex = state.activeImageIndex
  const activeImage = images[activeImageIndex]
  const imageNumber = images.length

  return activeImage ? (
    <Flex sx={{ flexDirection: 'column' }}>
      <Flex sx={{ width: '100%' }}>
        <Image
          loading="lazy"
          data-cy="active-image"
          data-testid="active-image"
          sx={{
            width: '100%',
            cursor: 'pointer',
            objectFit: props.allowPortrait ? 'contain' : 'cover',
            height: [300, 450],
          }}
          src={activeImage.downloadUrl}
          onClick={() => {
            triggerLightbox()
          }}
          alt={activeImage.name}
          crossOrigin=""
        />
      </Flex>
      <Flex sx={{ width: '100%', flexWrap: 'wrap' }} mx={[2, 2, '-5px']}>
        {imageNumber > 1
          ? images.map((image: any, index: number) => (
              <ThumbCard
                data-cy="thumbnail"
                mb={3}
                mt={4}
                opacity={image === activeImage ? 1.0 : 0.5}
                onClick={() => setActive(index)}
                key={index}
              >
                <Image
                  loading="lazy"
                  src={image.downloadUrl}
                  key={index}
                  alt={image.name}
                  sx={{
                    width: 100,
                    height: 67,
                    objectFit: props.allowPortrait ? 'contain' : 'cover',
                    borderRadius: 1,
                    border: '1px solid offwhite',
                  }}
                  crossOrigin=""
                />
              </ThumbCard>
            ))
          : null}
      </Flex>

      {state.showLightbox && (
        <Lightbox
          mainSrc={activeImage.downloadUrl}
          nextSrc={images[(activeImageIndex + 1) % images.length].downloadUrl}
          prevSrc={
            images[(activeImageIndex + images.length - 1) % images.length]
              .downloadUrl
          }
          onMovePrevRequest={() => {
            setState({
              ...state,
              activeImageIndex:
                (activeImageIndex + images.length - 1) % images.length,
            })
          }}
          onMoveNextRequest={() =>
            setState({
              ...state,
              activeImageIndex: (activeImageIndex + 1) % images.length,
            })
          }
          onCloseRequest={() => triggerLightbox()}
        />
      )}
    </Flex>
  ) : null
}
