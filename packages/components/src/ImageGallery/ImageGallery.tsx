import 'photoswipe/style.css'
import { useEffect, useRef, useState } from 'react'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import type { PhotoSwipeOptions } from 'photoswipe/lightbox'
import type { CardProps } from 'theme-ui'
import { Box, Flex, Image as ThemeImage } from 'theme-ui'
import styled from '@emotion/styled'
import { relative } from 'path'

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

export interface ImageGalleryProps {
  images: IUploadedFileMeta[]
  allowPortrait?: boolean
  photoSwipeOptions?: PhotoSwipeOptions
  hideThumbnails?: boolean
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

export const ImageGallery = (props: ImageGalleryProps) => {
  const [state, setState] = useState<IState>({
    activeImageIndex: 0,
    showLightbox: false,
    images: [],
  })
  const lightbox = useRef<PhotoSwipeLightbox>()

  useEffect(() => {
    const images = (props.images || []).filter((img) => img !== null)
    setState({
      ...state,
      activeImageIndex: 0,
      images: images,
    })

    // Initializes the Photoswipe lightbox to use the provided images
    lightbox.current = new PhotoSwipeLightbox({
      dataSource: images.map((image) => ({
        src: image.downloadUrl,
      })),
      pswpModule: () => import('photoswipe'),
      ...(props.photoSwipeOptions ?? {}),
    })

    // Before opening the lightbox, calculates the image sizes and
    // refreshes lightbox slide to adapt to these updated dimensions
    lightbox.current.on('beforeOpen', () => {
      const photoswipe = lightbox.current?.pswp
      const dataSource = photoswipe?.options?.dataSource

      if (Array.isArray(dataSource)) {
        dataSource.forEach((source, index) => {
          const img = new Image()
          img.onload = () => {
            source.width = img.naturalWidth
            source.height = img.naturalHeight
            photoswipe?.refreshSlideContent(index)
          }
          img.src = source.src as string
        })
      }
    })

    lightbox.current.init()

    return () => {
      lightbox.current?.destroy()
      lightbox.current = undefined
    }
  }, [props.images])

  const setActive = (imageIndex: number) => {
    setState({
      ...state,
      activeImageIndex: imageIndex,
    })
  }

  const triggerLightbox = (): void => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Looks like a bug on their side, already a bug for it is open,
    // it should allow only one argument, as mentioned in their docs
    lightbox.current?.loadAndOpen(state.activeImageIndex)
  }

  const images = state.images
  const activeImageIndex = state.activeImageIndex
  const activeImage = images[activeImageIndex]
  const imageNumber = images.length
  const showThumbnails = !props.hideThumbnails && images.length >= 1

  return activeImage ? (
    <Flex sx={{ flexDirection: 'column' }}>
      <Flex sx={{ width: '100%', position: 'relative' }}>
        <ThemeImage
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
        <button
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            height: '100%',
          }}
          onClick={() =>
            setActive(
              activeImageIndex + 1 < imageNumber ? activeImageIndex + 1 : 0,
            )
          }
        >
          Next
        </button>
        <button
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
          }}
          onClick={() =>
            setActive(
              activeImageIndex - 1 >= 0
                ? activeImageIndex - 1
                : imageNumber - 1,
            )
          }
        >
          Prev
        </button>
      </Flex>
      {showThumbnails ? (
        <Flex sx={{ width: '100%', flexWrap: 'wrap' }} mx={[2, 2, '-5px']}>
          {images.map((image: any, index: number) => (
            <ThumbCard
              data-cy="thumbnail"
              data-testid="thumbnail"
              mb={3}
              mt={4}
              opacity={image === activeImage ? 1.0 : 0.5}
              onClick={() => setActive(index)}
              key={index}
            >
              <ThemeImage
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
          ))}
        </Flex>
      ) : null}
    </Flex>
  ) : null
}
