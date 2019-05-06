import * as React from 'react'
import { BoxContainer } from 'src/components/Layout/BoxContainer'

interface IProps {
  test?: string
}
interface IState {
  pageName?: string
}

export class FeedbackPage extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    // initial state can be set here, update later via setState method
    this.state = { pageName: 'Demo Page Template' }
  }

  public render() {
    return (
      <BoxContainer p={0} bg="white">
        <iframe
          style={{ width: '100%', height: 'calc(100vh - 200px)' }}
          src="https://feedback.userreport.com/10883867-1bec-4892-9089-85f904f4d37b/"
        />
      </BoxContainer>
    )
  }
}
