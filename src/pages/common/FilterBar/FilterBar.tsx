import * as React from 'react'

import { Container } from './elements'

interface IProps {
  prop: string
}

export class FilterBar extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props)
  }

  public componentDidUpdate(prevProps: IProps) {
    // component updated
  }

  render() {
    return <Container>HELLO</Container>
  }
}

export default Container
