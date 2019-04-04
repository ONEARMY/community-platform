import React from 'react'

import { Container } from './elements'
import { IHowtoStep } from 'src/models/howto.models'

interface IProps {
  step: IHowtoStep
}

export default class HowtoSummary extends React.PureComponent<IProps> {
  render() {
    return (
      <Container>
        <h1>{this.props.step.title}</h1>
      </Container>
    )
  }
}
