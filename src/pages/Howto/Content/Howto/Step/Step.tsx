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
import { IHowtoStep } from 'src/models/howto.models'

export default class Step extends React.PureComponent<any, any> {
  constructor(props: any) {
    super(props)
  }

  public renderImages(step: IHowtoStep) {
    // If we have multiple images
    if (step.images.length > 1) {
      const preloadedImages: any[] = []
      // Preload images and add them to preloadedImages array
      for (const image of step.images) {
        const imageObj = new Image()
        imageObj.src = image.downloadUrl
        preloadedImages.push({
          src: imageObj.src,
        })
      }
      // Return the <img> element from preloaded images
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
      // else if only one image
    } else if (step.images.length === 1) {
      return <StepImage src={step.images[0].downloadUrl} />
    } else {
      return null
    }
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
            {this.renderImages(step)}
          </CardContent>
        </StepCard>
      </Container>
    )
  }
}
