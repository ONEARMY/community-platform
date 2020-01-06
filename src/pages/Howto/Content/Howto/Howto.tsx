import * as React from 'react'
import { RouteComponentProps } from 'react-router'
// TODO add loader (and remove this material-ui dep)
import Heading from 'src/components/Heading'
import { inject, observer } from 'mobx-react'
import { HowtoStore } from 'src/stores/Howto/howto.store'
import HowtoDescription from './HowtoDescription/HowtoDescription'
import Step from './Step/Step'
import { IHowtoDB } from 'src/models/howto.models'
// import HowtoSummary from './HowtoSummary/HowtoSummary'
import Text from 'src/components/Text'
import { Box, Flex } from 'rebass/styled-components'
import { Button } from 'src/components/Button'
import styled from 'styled-components'
import theme from 'src/themes/styled.theme'
import WhiteBubble0 from 'src/assets/images/white-bubble_0.svg'
import WhiteBubble1 from 'src/assets/images/white-bubble_1.svg'
import WhiteBubble2 from 'src/assets/images/white-bubble_2.svg'
import WhiteBubble3 from 'src/assets/images/white-bubble_3.svg'
import { Link } from 'src/components/Links'
import { zIndex } from 'src/themes/styled.theme'
import { Loader } from 'src/components/Loader'

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
  howto?: IHowtoDB
  isLoading: boolean
}
const MoreBox = styled(Box)`
  position: relative;
  &:after {
    content: '';
    background-image: url(${WhiteBubble0});
    width: 100%;
    height: 100%;
    z-index: ${zIndex.behind};
    background-size: contain;
    background-repeat: no-repeat;
    position: absolute;
    top: 55%;
    transform: translate(-50%, -50%);
    left: 50%;
    max-width: 850px;
    background-position: center 10%;
  }

  @media only screen and (min-width: ${theme.breakpoints[0]}) {
    &:after {
      background-image: url(${WhiteBubble1});
    }
  }

  @media only screen and (min-width: ${theme.breakpoints[1]}) {
    &:after {
      background-image: url(${WhiteBubble2});
    }
  }

  @media only screen and (min-width: ${theme.breakpoints[2]}) {
    &:after {
      background-image: url(${WhiteBubble3});
    }
  }
`

@inject('howtoStore')
@observer
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

  get store() {
    return this.injected.howtoStore
  }

  private moderateHowto = async (accepted: boolean) => {
    const howto = this.state.howto
    if (!howto) {
      return false
    }
    howto.moderation = accepted ? 'accepted' : 'rejected'
    await this.store.moderateHowto(howto)
    this.setState({
      howto,
      isLoading: this.state.isLoading,
    })
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
    const loggedInUser = this.injected.howtoStore.activeUser
    if (howto) {
      return (
        <>
          <HowtoDescription
            howto={howto}
            loggedInUser={loggedInUser}
            needsModeration={this.store.needsModeration(howto)}
            moderateHowto={this.moderateHowto}
          />
          {/* <HowtoSummary steps={howto.steps} howToSlug={howto.slug} /> */}
          <Box mt={9}>
            {howto.steps.map((step: any, index: number) => (
              <Step step={step} key={index} stepindex={index} />
            ))}
          </Box>
          <MoreBox py={20} mt={20}>
            <Text bold txtcenter fontSize={[4, 4, 5]}>
              You're done.
              <br />
              Nice one!
            </Text>
            <Flex justifyContent={'center'} mt={2}>
              <Link to={'/how-to/'}>
                <Button variant={'secondary'} data-cy="go-back">
                  Back
                </Button>
              </Link>
            </Flex>
          </MoreBox>
        </>
      )
    } else {
      return isLoading ? (
        <Loader />
      ) : (
        <Text txtcenter mt="50px" width={1}>
          How-to not found
        </Text>
      )
    }
  }
}
