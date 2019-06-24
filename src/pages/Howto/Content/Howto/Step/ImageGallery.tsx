import React from 'react'
import { Box, Image, Card, Flex } from 'rebass'
import { IUploadedFileMeta } from 'src/stores/storage'

interface IProps {
  images: IUploadedFileMeta[]
}

interface IState {
  activeImage: IUploadedFileMeta
}

export default class ImageGallery extends React.PureComponent<IProps, IState> {
  constructor(props) {
    super(props)
    this.state = { activeImage: this.props.images[0] }
  }

  setActive = image => {
    this.setState({
      activeImage: image,
    })
  }

  render() {
    let imageNumber = this.props.images.length
    return this.state.activeImage ? (
      <Box>
        <Image px={1} pb={4} src={this.state.activeImage.downloadUrl} />
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
      </Box>
    ) : null
  }
}
