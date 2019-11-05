import React from 'react'
import { Image, Card, Flex } from 'rebass/styled-components'
import { IUploadedFileMeta } from 'src/stores/storage'
import Lightbox from 'react-image-lightbox'
import Text from 'src/components/Text'
import styled from 'styled-components'

interface IProps {
  images: IUploadedFileMeta[]
  caption?: string
}

interface IState {
  activeImage: IUploadedFileMeta | null
  showLightbox: boolean
  images: Array<IUploadedFileMeta>
  imgIndex: number
}

const ThumbCard = styled(Card)`
  padding: 5px;
  overflow: hidden;
  transition: 0.2s ease-in-out;
  &:hover {
    transform: translateY(-5px);
  }
`

const ThumbImage = styled(Image)`
  object-fit: cover;
  width: 100px;
  height: 67px;
  border: 1px solid #ececec;
  border-radius: 5px;
`

const ImageWithPointer = styled(Image)`
  cursor: pointer;
  width: 100%;
  height: 450px;
  object-fit: cover;
  border-radius: 0px 8px 0px 5px;
`

export default class ImageGallery extends React.PureComponent<IProps, IState> {
  constructor(props) {
    super(props)
    this.state = {
      activeImage: null,
      showLightbox: false,
      images: [],
      imgIndex: 0,
    }
  }

  componentWillMount() {
    const images = this.props.images.filter(img => img !== null)
    const activeImage = images.length > 0 ? images[0] : null
    this.setState({
      activeImage,
      images,
    })
  }

  setActive = image => {
    this.setState({
      activeImage: image,
    })
  }

  triggerLightbox = (): void =>
    this.setState(({ showLightbox }) => {
      return {
        showLightbox: !showLightbox,
      }
    })

  render() {
    const images = this.state.images
    const imageNumber = images.length
    const { caption } = this.props
    return this.state.activeImage ? (
      <Flex flexDirection={'column'}>
        <Flex width={1}>
          <ImageWithPointer
            data-cy="active-image"
            width={1}
            src={this.state.activeImage.downloadUrl}
            onClick={() => {
              this.triggerLightbox()
            }}
          />
        </Flex>
        <Flex flexWrap={'wrap'} width={1} mx={[2, 2, '-5px']}>
          {imageNumber > 1
            ? images.map((image: any, index: number) => (
                <ThumbCard
                  data-cy="thumbnail"
                  mb={3}
                  mt={4}
                  opacity={image === this.state.activeImage ? 1.0 : 0.5}
                  onClick={() => this.setActive(image)}
                  key={index}
                >
                  <ThumbImage src={image.downloadUrl} key={index} />
                </ThumbCard>
              ))
            : null}
        </Flex>

        {this.state.showLightbox && (
          <Lightbox
            mainSrc={this.state.images[this.state.imgIndex].downloadUrl}
            imageCaption={this.props.caption}
            nextSrc={
              this.state.images[
                (this.state.imgIndex + 1) % this.state.images.length
              ].downloadUrl
            }
            prevSrc={
              this.state.images[
                (this.state.imgIndex + this.state.images.length - 1) %
                  this.state.images.length
              ].downloadUrl
            }
            onMovePrevRequest={() => {
              this.setState({
                imgIndex:
                  (this.state.imgIndex + this.state.images.length - 1) %
                  this.state.images.length,
              })
            }}
            onMoveNextRequest={() =>
              this.setState({
                imgIndex: (this.state.imgIndex + 1) % this.state.images.length,
              })
            }
            onCloseRequest={() => this.triggerLightbox()}
          />
        )}
      </Flex>
    ) : null
  }
}
