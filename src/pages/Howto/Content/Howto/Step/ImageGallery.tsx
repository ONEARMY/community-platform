import React from 'react'
import { Image, Card, Flex } from 'rebass'
import { IUploadedFileMeta } from 'src/stores/storage'
import Lightbox from 'react-image-lightbox'
import styled from 'styled-components'

interface IProps {
  images: IUploadedFileMeta[]
  caption?: string
}

interface IState {
  activeImage: IUploadedFileMeta
  showLightbox: boolean
}

const ImageWithPointer = styled(Image)`
  cursor: pointer;
`

export default class ImageGallery extends React.PureComponent<IProps, IState> {
  constructor(props) {
    super(props)
    this.state = { activeImage: this.props.images[0], showLightbox: false }
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
    let imageNumber = this.props.images.length
    return this.state.activeImage ? (
      <Flex flexDirection="column" alignItems="center">
        <ImageWithPointer
          width={[1, 1, 0.5]}
          px={1}
          pb={4}
          src={this.state.activeImage.downloadUrl}
          onClick={() => {
            this.triggerLightbox()
          }}
        />
        <Flex flexWrap={'wrap'}>
          {imageNumber > 1
            ? this.props.images.map((image: any, index: number) => (
                <Card
                  p={1}
                  opacity={image === this.state.activeImage ? 1.0 : 0.5}
                  onClick={() => this.setActive(image)}
                >
                  <Image
                    height={[50, 100, 200]}
                    src={image.downloadUrl}
                    key={index}
                  />
                </Card>
              ))
            : null}
        </Flex>

        {this.state.showLightbox && (
          <Lightbox
            mainSrc={this.state.activeImage.downloadUrl}
            imageCaption={this.props.caption}
            onCloseRequest={() => this.triggerLightbox()}
          />
        )}
      </Flex>
    ) : null
  }
}
