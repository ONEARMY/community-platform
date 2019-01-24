import * as React from 'react'

import { Container } from './elements'
import Margin from 'src/components/Layout/Margin.js'

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
    return <Margin className="filter" vertical={1.5} />
  }
}

export default Container
