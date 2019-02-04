import React from 'react'
import Linkify from 'react-linkify'
import CardContent from '@material-ui/core/CardContent'

import {
  Container,
  StepCard,
  StepHeader,
  StepIndex,
  StepTitle,
  StepDescription,
  StepImage,
} from './elements'
import { IHowtoStep } from 'src/models/howto.models'
import {IFirebaseUploadInfo} from "../../../../common/FirebaseFileUploader/FirebaseFileUploader";

interface IProps {
  step: IHowtoStep,
  stepindex: number,
}

export default class Step extends React.PureComponent<IProps> {
  renderImages = (images: IFirebaseUploadInfo[]) => (
      images.map((image: any, index: number) => (
          <StepImage src={image.downloadUrl} key={index}/>
      ))
  );

  render() {
    return (
        <Container>
          <StepCard>
            <StepHeader>
              <StepIndex variant="h5">STEP {this.props.stepindex + 1}</StepIndex>
            </StepHeader>
            <CardContent>
              <StepTitle variant="h5" component="h2">
                {this.props.step.title}
              </StepTitle>
              <StepDescription component="p">
                <Linkify>{this.props.step.text}</Linkify>
              </StepDescription>
              {this.renderImages(this.props.step.images)}
            </CardContent>
          </StepCard>
        </Container>
    )
  }
}
