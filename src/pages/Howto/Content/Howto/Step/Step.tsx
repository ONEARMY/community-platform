import React from 'react'
import Linkify from 'react-linkify'
import { IHowtoStep } from 'src/models/howto.models'
import { Box, Image } from 'rebass'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import { IUploadedFileMeta } from 'src/stores/storage'

interface IProps {
  step: IHowtoStep
  stepindex: number
}

export default class Step extends React.PureComponent<IProps> {
  renderImages = (images: IUploadedFileMeta[]) =>
    images.map((image: any, index: number) => (
      <Image src={image.downloadUrl} key={index} />
    ))

  render() {
    return (
      <Box pt={5} id={this.props.step.title}>
        <Heading bold large>
          Step {this.props.stepindex + 1}:&nbsp;
          <Heading inline large regular>
            {this.props.step.title}
          </Heading>
        </Heading>
        <Text regular preLine my={4}>
          <Linkify>{this.props.step.text}</Linkify>
        </Text>
        {this.renderImages(this.props.step.images as IUploadedFileMeta[])}
      </Box>
    )
  }
}
