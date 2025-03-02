import { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import { Flex, Image as ThemeImage } from 'theme-ui'

import { Icon } from '../Icon/Icon'
import { ImageGalleryThumbnail } from '../ImageGalleryThumbnail/ImageGalleryThumbnail'
import { Loader } from '../Loader/Loader'

import type { PhotoSwipeOptions } from 'photoswipe/lightbox'

import 'photoswipe/style.css'

export interface IImageGalleryItem {
  downloadUrl: string
  thumbnailUrl: string
  contentType?: string | null
  fullPath: string
  name: string
  type: string
  size: number
  timeCreated: string
  updated: string
  alt?: string
}

export interface ImageGalleryProps {
  images: IImageGalleryItem[]
  allowPortrait?: boolean
  photoSwipeOptions?: PhotoSwipeOptions
  hideThumbnails?: boolean
  showNextPrevButton?: boolean
}

interface IState {
  activeImageIndex: number
  showLightbox: boolean
  images: Array<IImageGalleryItem>
  showActiveImgLoading: boolean
}

const NavButton = styled('button')`
   background: white;
  border: 3px solid black;
  position: absolute;
top: 50%;
  transform: translateY(-50%);
  height: 55px;
  width: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
   border-radius: 15px;
`

export const ImageGallery = (props: ImageGalleryProps) => {
  const [state, setState] = useState<IState>({
    activeImageIndex: 0,
    showLightbox: false,
    images: [],
    showActiveImgLoading: true,
  })
  const lightbox = useRef<PhotoSwipeLightbox>()

  useEffect(() => {
    const images = (props.images || []).filter((img) => img !== null)
    setState((state) => ({
      ...state,
      activeImageIndex: 0,
      images: images,
    }))

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
  }, [props.images, props.photoSwipeOptions])

  const setActive = (imageIndex: number) => {
    setState({
      ...state,
      activeImageIndex: imageIndex,
      showActiveImgLoading: imageIndex !== activeImageIndex,
    })
  }

  const setActiveImgLoaded = () => {
    setState({
      ...state,
      showActiveImgLoading: false,
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
  const showThumbnails = !props.hideThumbnails && images.length > 1
  const showNextPrevButton = !!props.showNextPrevButton && images.length > 1

  return activeImage ? (
    <Flex sx={{ flexDirection: 'column' }}>
      {state.showActiveImgLoading && (
        <Loader sx={{ position: 'absolute', alignSelf: 'center' }} />
      )}
      <Flex
        sx={{
          width: '100%',
          position: 'relative',
          opacity: `${state.showActiveImgLoading ? 0 : 1}`,
        }}
      >
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
          onClick={triggerLightbox}
          onLoad={setActiveImgLoaded}
          alt={activeImage.alt ?? activeImage.name}
          crossOrigin=""
        />
        {showNextPrevButton ? (
          <>
            <NavButton
              aria-label={'Next image'}
              style={{
                right: 10,
              }}
              onClick={() =>
                setActive(
                  activeImageIndex + 1 < imageNumber ? activeImageIndex + 1 : 0,
                )
              }
            >
              <Icon glyph="chevron-right" color="white" size={45} />
            </NavButton>
            <NavButton
              aria-label={'Previous image'}
              style={{
                left: 10,
              }}
              onClick={() =>
                setActive(
                  activeImageIndex - 1 >= 0
                    ? activeImageIndex - 1
                    : imageNumber - 1,
                )
              }
            >
               <Icon glyph="chevron-left" color="white" size={45} />
            </NavButton>
          </>
        ) : null}
      </Flex>
      {showThumbnails && (
        <Flex sx={{ width: '100%', flexWrap: 'wrap' }} mx={[2, 2, '-5px']}>
          {images.map((image, index: number) => (
            <ImageGalleryThumbnail
              activeImageIndex={activeImageIndex}
              allowPortrait={props.allowPortrait ?? false}
              setActiveIndex={setActive}
              key={image.thumbnailUrl}
              alt={image.alt}
              index={index}
              name={image.name}
              thumbnailUrl={image.thumbnailUrl}
            />
          ))}
        </Flex>
      )}
    </Flex>
  ) : null
}
