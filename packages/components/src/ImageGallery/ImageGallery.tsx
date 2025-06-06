import { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import { Flex, Image as ThemeImage } from 'theme-ui'

import { Arrow } from '../ArrowIcon/ArrowIcon'
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
  showActiveImgLoading: boolean
}

const NavButton = styled('button')`
  background: transparent;
  border: 0;
  position: absolute;
  top: 0;
  bottom: 0;
  height: 100%;
  cursor: pointer;
`

// Container that reserves space to prevent layout shift
const ImageContainer = styled('div')`
  width: 100%;
  position: relative;
  /* Reserve space for the image before it loads */
  min-height: 300px;

  @media (min-width: 768px) {
    min-height: 450px;
  }

  /* Ensure consistent aspect ratio */
  aspect-ratio: 16/9;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5; /* Optional: subtle background while loading */
`

export const ImageGallery = (props: ImageGalleryProps) => {
  // Initialize with actual images from props, not empty array
  const filteredImages = (props.images || []).filter((img) => img !== null)

  const [state, setState] = useState<IState>({
    activeImageIndex: 0,
    showLightbox: false,
    showActiveImgLoading: true,
  })

  const lightbox = useRef<PhotoSwipeLightbox>()
  const activeImageIndex = state.activeImageIndex
  const activeImage = filteredImages[activeImageIndex]
  const imageNumber = filteredImages.length
  const showThumbnails = !props.hideThumbnails && filteredImages.length > 1
  const showNextPrevButton =
    !!props.showNextPrevButton && filteredImages.length > 1

  // Only initialize PhotoSwipe on client-side
  useEffect(() => {
    if (typeof window === 'undefined' || !filteredImages.length) return

    // Initializes the Photoswipe lightbox to use the provided images
    lightbox.current = new PhotoSwipeLightbox({
      dataSource: filteredImages.map((image) => ({
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

  // Prevent native hash scrolling and handle it ourselves
  useEffect(() => {
    if (typeof window === 'undefined') return

    let originalHash = ''

    const preventNativeHashScroll = () => {
      if (window.location.hash) {
        originalHash = window.location.hash
        // Remove hash completely to prevent any native scrolling
        window.history.replaceState(
          null,
          '',
          window.location.pathname + window.location.search,
        )

        // Prevent any scroll restoration
        if ('scrollRestoration' in window.history) {
          window.history.scrollRestoration = 'manual'
        }
      }
    }

    // Restore hash after component mounts
    const restoreHash = () => {
      if (originalHash) {
        setTimeout(() => {
          window.history.replaceState(
            null,
            '',
            window.location.pathname + window.location.search + originalHash,
          )
        }, 50)
      }
    }

    preventNativeHashScroll()
    restoreHash()

    return () => {
      // Restore scroll restoration on cleanup
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto'
      }
    }
  }, [])

  const setActive = (imageIndex: number) => {
    setState({
      ...state,
      activeImageIndex: imageIndex,
      showActiveImgLoading: imageIndex !== state.activeImageIndex,
    })
  }

  const setActiveImgLoaded = () => {
    setState({
      ...state,
      showActiveImgLoading: false,
    })
  }

  const handleImageLoad = () => {
    setActiveImgLoaded()
  }

  const handleImageError = () => {
    // Also clear loading state on error
    setActiveImgLoaded()
  }

  // Check if image is already loaded (cached)
  useEffect(() => {
    if (activeImage) {
      const img = new Image()
      img.onload = () => {
        if (img.complete) {
          setActiveImgLoaded()
        }
      }
      img.src = activeImage.downloadUrl

      // If image is already complete, clear loading immediately
      if (img.complete) {
        setActiveImgLoaded()
      }
    }
  }, [activeImage?.downloadUrl])

  const triggerLightbox = (): void => {
    if (typeof window === 'undefined') return

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Looks like a bug on their side, already a bug for it is open,
    // it should allow only one argument, as mentioned in their docs
    lightbox.current?.loadAndOpen(state.activeImageIndex)
  }

  // Early return if no images - but this should rarely happen now
  if (!filteredImages.length) {
    return null
  }

  return (
    <Flex sx={{ flexDirection: 'column' }}>
      <ImageContainer>
        {state.showActiveImgLoading && (
          <Loader
            sx={{ position: 'absolute', alignSelf: 'center', zIndex: 1 }}
          />
        )}
        <ThemeImage
          data-cy="active-image"
          data-testid="active-image"
          sx={{
            width: '100%',
            height: '100%',
            cursor: 'pointer',
            objectFit: props.allowPortrait ? 'contain' : 'cover',
            opacity: state.showActiveImgLoading ? 0.3 : 1,
            transition: 'opacity 0.2s ease-in-out',
          }}
          src={activeImage.downloadUrl}
          onClick={triggerLightbox}
          onLoad={handleImageLoad}
          onError={handleImageError}
          alt={activeImage.alt ?? activeImage.name}
          crossOrigin=""
        />
        {showNextPrevButton ? (
          <>
            <NavButton
              aria-label={'Next image'}
              style={{
                right: 0,
                zIndex: 2,
              }}
              onClick={() =>
                setActive(
                  activeImageIndex + 1 < imageNumber ? activeImageIndex + 1 : 0,
                )
              }
            >
              <Arrow direction="right" sx={{ marginRight: '10px' }} />
            </NavButton>
            <NavButton
              aria-label={'Previous image'}
              style={{
                left: 0,
                zIndex: 2,
              }}
              onClick={() =>
                setActive(
                  activeImageIndex - 1 >= 0
                    ? activeImageIndex - 1
                    : imageNumber - 1,
                )
              }
            >
              <Arrow direction="left" sx={{ marginLeft: '10px' }} />
            </NavButton>
          </>
        ) : null}
      </ImageContainer>
      {showThumbnails && (
        <Flex sx={{ width: '100%', flexWrap: 'wrap' }} mx={[2, 2, '-5px']}>
          {filteredImages.map((image, index: number) => (
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
  )
}
