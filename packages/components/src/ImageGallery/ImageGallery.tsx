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
  activeImage: IUploadedFileMeta | null
  showLightbox: boolean
  images: Array<IUploadedFileMeta>
  imgIndex: number
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
    activeImage: null,
    showLightbox: false,
    images: [],
    imgIndex: 0,
  })

  useEffect(() => {
    const images = (props.images || []).filter((img) => img !== null)
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

  const images = state.images
  const imageNumber = images.length

  return state.activeImage ? (
    <Flex sx={{ flexDirection: 'column' }}>
      <Flex sx={{ width: '100%' }}>
        <Image
          loading="lazy"
          data-cy="active-image"
          sx={{
            width: '100%',
            cursor: 'pointer',
            objectFit: props.allowPortrait ? 'contain' : 'cover',
            height: [300, 450],
          }}
          src={state.activeImage.downloadUrl}
          onClick={() => {
            triggerLightbox()
          }}
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
                opacity={image === state.activeImage ? 1.0 : 0.5}
                onClick={() => setActive(image)}
                key={index}
              >
                <Image
                  loading="lazy"
                  src={image.downloadUrl}
                  key={index}
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
