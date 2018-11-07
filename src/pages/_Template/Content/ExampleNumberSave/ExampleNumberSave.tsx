import * as React from 'react'
import { Button } from '@material-ui/core'

interface IProps {
  number: number
}
interface IState {
  state1: string
}
export class ExampleNumberSave extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props)
  }

  public render() {
    return (
      <div>
        <Button>Save Number</Button>
      </div>
    )
  }
}
