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
  imagesList: string[]
  imgIndex: number
}

const ImageWithPointer = styled(Image)`
  cursor: pointer;
`

export default class ImageGallery extends React.PureComponent<IProps, IState> {
  constructor(props) {
    super(props)
    this.state = {
      activeImage: this.props.images[0],
      showLightbox: false,
      imagesList: [],
      imgIndex: 0,
    }
  }

  componentWillMount() {
    this.setState({ imagesList: this.objectToList(this.props.images) })
  }

  setActive = image => {
    this.setState({
      activeImage: image,
    })
  }

  public objectToList(images: IUploadedFileMeta[]) {
    let arrayLIst: string[] = []
    images.map(image => {
      arrayLIst.push(image.downloadUrl)
    })
    return arrayLIst
  }

  triggerLightbox = (): void =>
    this.setState(({ showLightbox }) => {
      return {
        showLightbox: !showLightbox,
      }
    })

  render() {
    const imageNumber = this.props.images.length
    console.log((this.state.imgIndex + 1) % this.state.imagesList.length)
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
                  key={index}
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
            mainSrc={this.state.imagesList[this.state.imgIndex]}
            imageCaption={this.props.caption}
            nextSrc={
              this.state.imagesList[
                (this.state.imgIndex + 1) % this.state.imagesList.length
              ]
            }
            prevSrc={
              this.state.imagesList[
                (this.state.imgIndex + this.state.imagesList.length - 1) %
                  this.state.imagesList.length
              ]
            }
            onMovePrevRequest={() => {
              this.setState({
                imgIndex:
                  (this.state.imgIndex + this.state.imagesList.length - 1) %
                  this.state.imagesList.length,
              })
            }}
            onMoveNextRequest={() =>
              this.setState({
                imgIndex:
                  (this.state.imgIndex + 1) % this.state.imagesList.length,
              })
            }
            onCloseRequest={() => this.triggerLightbox()}
          />
        )}
      </Flex>
    ) : null
  }
}
