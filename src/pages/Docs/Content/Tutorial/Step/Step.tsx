import React from 'react'

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
import { ITutorialStep } from 'src/models/tutorial.models'

export default class Step extends React.PureComponent<any, any> {
  constructor(props: any) {
    super(props)
  }

  public renderMultipleImages(step: ITutorialStep) {
    const preloadedImages: any[] = []
    for (const image of step.images) {
      const imageObj = new Image()
      imageObj.src = image.downloadUrl
      preloadedImages.push({
        src: imageObj.src,
      })
    }
    return preloadedImages.map((image: any, index: number) =>
      index !== 1 ? (
        <StepImage src={image.src} key={index} />
      ) : (
        <StepImage
          style={{ margin: '20px auto' }}
          src={image.src}
          key={index}
        />
      ),
    )
  }

  public renderUniqueImage(url: string) {
    return <StepImage src={url} />
  }

  public render() {
    const { step, stepindex } = this.props

    return (
      <Container>
        <StepCard>
          <StepHeader>
            <StepIndex variant="h5">Step {stepindex + 1}</StepIndex>
          </StepHeader>
          <CardContent>
            <StepTitle variant="h5" component="h2">
              {step.title}
            </StepTitle>
            <StepDescription component="p">{step.text}</StepDescription>
            {step.images.length > 1
              ? this.renderMultipleImages(step)
              : this.renderUniqueImage(step.images[0])}
          </CardContent>
        </StepCard>
      </Container>
    )
  }
}
