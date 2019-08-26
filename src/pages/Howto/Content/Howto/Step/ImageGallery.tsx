import React from 'react'
import { Image, Card, Flex } from 'rebass'
import { IUploadedFileMeta } from 'src/stores/storage'
import Lightbox from 'react-image-lightbox'
import Text from 'src/components/Text'
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
    const { caption } = this.props
    console.log((this.state.imgIndex + 1) % this.state.imagesList.length)
    return this.state.activeImage ? (
      <Flex flexDirection={'column'}>
        <Flex width={1}>
          <ImageWithPointer
            width={1}
            src={this.state.activeImage.downloadUrl}
            onClick={() => {
              this.triggerLightbox()
            }}
          />
        </Flex>
        <Flex flexWrap={'wrap'} width={1} mx={[2, 2, '-5px']}>
          {imageNumber > 1
            ? this.props.images.map((image: any, index: number) => (
                <ThumbCard
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
