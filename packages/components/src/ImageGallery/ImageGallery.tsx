import 'react-image-lightbox/style.css'
import { useEffect, useState } from 'react'
import Lightbox from 'react-image-lightbox'
import { Box, Flex, Image } from 'theme-ui'
import styled from '@emotion/styled'
import { useTheme } from '@emotion/react'
import type { PlatformThemeStyles } from '../../types/theme'

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
}

interface IState {
  activeImage: IUploadedFileMeta | null
  showLightbox: boolean
  images: Array<IUploadedFileMeta>
  imgIndex: number
}

export const ImageGallery = (props: IProps) => {
  const [state, setState] = useState<IState>({
    activeImage: null,
    showLightbox: false,
    images: [],
    imgIndex: 0,
  })
  const theme = useTheme() as PlatformThemeStyles

  useEffect(() => {
    const images = props.images.filter((img) => img !== null)
    const activeImage = images.length > 0 ? images[0] : null
    setState({
      ...state,
      activeImage: activeImage,
      images: images,
    })
  }, [])

  const setActive = (image: IUploadedFileMeta) => {
    setState({
      ...state,
      activeImage: image,
    })
  }

  const triggerLightbox = (): void =>
    setState(({ showLightbox }) => {
      return {
        ...state,
        showLightbox: !showLightbox,
      }
    })

  const ImageWithPointer = styled(Image)`
    cursor: pointer;
    width: 100%;
    height: 450px;
    object-fit: cover;

    // Reduce height for mobile devices
    @media (max-width: ${theme.breakpoints[0]}) {
      height: 300px;
    }
  `

  const images = state.images
  const imageNumber = images.length

  return state.activeImage ? (
    <Flex sx={{ flexDirection: 'column' }}>
      <Flex sx={{ width: '100%' }}>
        <ImageWithPointer
          loading="lazy"
          data-cy="active-image"
          sx={{ width: '100%' }}
          src={state.activeImage.downloadUrl}
          onClick={() => {
            triggerLightbox()
          }}
          crossOrigin=""
        />
      </Flex>
      <Flex sx={{ width: '100%', flexWrap: 'wrap' }} mx={[2, 2, '-5px']}>
        {imageNumber > 1
          ? images.map((image: IUploadedFileMeta, index: number) => (
              <Box
                data-cy="thumbnail"
                onClick={() => setActive(image)}
                key={index}
                sx={{
                  mb: 3,
                  mt: 4,
                  mx: 1,
                  opacity: image === state.activeImage ? 1.0 : 0.5,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  transition: '0.2s ease-in-out',
                  border: `1px solid ${theme.colors.offwhite}`,
                  lineHeight: 0,
                  borderRadius: 1,
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                }}
              >
                <Image
                  loading="lazy"
                  src={image.downloadUrl}
                  key={index}
                  sx={{
                    objectFit: 'cover',
                    width: '100px',
                    height: '67px',
                  }}
                  crossOrigin=""
                />
              </Box>
            ))
          : null}
      </Flex>

      {state.showLightbox && (
        <Lightbox
          mainSrc={state.images[state.imgIndex].downloadUrl}
          nextSrc={
            images[(state.imgIndex + 1) % state.images.length].downloadUrl
          }
          prevSrc={
            state.images[
              (state.imgIndex + state.images.length - 1) % state.images.length
            ].downloadUrl
          }
          onMovePrevRequest={() => {
            setState({
              ...state,
              imgIndex:
                (state.imgIndex + state.images.length - 1) %
                state.images.length,
            })
          }}
          onMoveNextRequest={() =>
            setState({
              ...state,
              imgIndex: (state.imgIndex + 1) % state.images.length,
            })
          }
          onCloseRequest={() => triggerLightbox()}
        />
      )}
    </Flex>
  ) : null
}
