import * as React from 'react'
import MainLayout from '../common/MainLayout'
import PageContainer from 'src/components/Layout/PageContainer'
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

  public componentDidMount() {
    // call methods you want to fire once when component mounted
    const script = document.createElement('script')

    script.src = '/assets/userReport.js'
    script.async = true

    document.body.appendChild(script)
  }

  public render() {
    return (
      <MainLayout>
        <PageContainer>
          <BoxContainer bg="white">
            <iframe
              style={{ width: '100%', height: 'calc(100vh - 300px)' }}
              src="https://feedback.userreport.com/10883867-1bec-4892-9089-85f904f4d37b/"
            />
          </BoxContainer>
        </PageContainer>
      </MainLayout>
    )
  }
}
