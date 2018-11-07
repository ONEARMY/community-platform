import * as React from 'react'

interface IProps {
  number: number
}
interface IState {
  state1: string
}
export class ExampleNumberDisplay extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props)
  }

  public render() {
    return <div>The magic number is {this.props.number}</div>
  }
}
