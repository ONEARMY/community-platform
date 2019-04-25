import React from 'react'
import Linkify from 'react-linkify'
import { IHowtoStep } from 'src/models/howto.models'
import { IFirebaseUploadInfo } from '../../../../../components/FirebaseFileUploader/FirebaseFileUploader'
import { Box, Image } from 'rebass'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'

interface IProps {
  step: IHowtoStep
  stepindex: number
}

export default class Step extends React.PureComponent<IProps> {
  renderImages = (images: IFirebaseUploadInfo[]) =>
    images.map((image: any, index: number) => (
      <Image src={image.downloadUrl} key={index} />
    ))

  render() {
    return (
      <Box id={this.props.step.title}>
        <Heading bold large>
          Step {this.props.stepindex + 1}:&nbsp;
          <Heading inline large regular>
            {this.props.step.title}
          </Heading>
        </Heading>
        <Text regular my={4}>
          <Linkify>{this.props.step.text}</Linkify>
        </Text>
        {this.renderImages(this.props.step.images)}
      </Box>
    )
  }
}
