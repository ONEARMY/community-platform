import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import LinearProgress from '@material-ui/core/LinearProgress'
import { afs } from 'src/utils/firebase'
import { inject } from 'mobx-react'
import { HowtoStore } from 'src/stores/Howto/howto.store'
import HowtoDescription from './HowtoDescription/HowtoDescription'
import Step from './Step/Step'
import { IHowtoStep, IHowto } from 'src/models/howto.models'
import HowtoSummary from './HowtoSummary/HowtoSummary'
import { Box } from 'rebass'

// The parent container injects router props along with a custom slug parameter (RouteComponentProps<IRouterCustomParams>).
// We also have injected the doc store to access its methods to get doc by slug.
// We can't directly provide the store as a prop though, and later user a get method to define it
interface IRouterCustomParams {
  slug: string
}
interface InjectedProps extends RouteComponentProps<IRouterCustomParams> {
  howtoStore: HowtoStore
}
interface IState {
  howto?: IHowto
  isLoading: boolean
}
@inject('howtoStore')
export class Howto extends React.Component<
  RouteComponentProps<IRouterCustomParams>,
  IState
> {
  constructor(props: any) {
    super(props)
    this.state = {
      howto: undefined,
      isLoading: true,
    }
  }
  // workaround used later so that userStore can be called in render method when not existing on
  get injected() {
    return this.props as InjectedProps
  }

  public async componentWillMount() {
    const slug = this.props.match.params.slug
    const doc = await this.injected.howtoStore.getDocBySlug(slug)
    this.setState({
      howto: doc,
      isLoading: false,
    })
  }

  public render() {
    const { howto, isLoading } = this.state
    if (howto) {
      return (
        <>
          <HowtoDescription howto={howto} />
          {/* <HowtoSummary steps={howto.steps} howToSlug={howto.slug} /> */}
          <Box my={4} p={5} bg={'white'}>
            {howto.steps.map((step: any, index: number) => (
              <Step step={step} key={index} stepindex={index} />
            ))}
          </Box>
        </>
      )
    } else {
      return isLoading ? <LinearProgress /> : <div>How-to not found</div>
    }
  }
}
