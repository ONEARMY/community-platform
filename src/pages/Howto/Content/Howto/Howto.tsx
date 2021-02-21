import * as React from 'react'
import { RouteComponentProps } from 'react-router'
// TODO add loader (and remove this material-ui dep)
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
import { Route } from 'react-router-dom'
import { NotFoundPage } from '../../../NotFound/NotFound'
import { UserStore } from 'src/stores/User/user.store'
// The parent container injects router props along with a custom slug parameter (RouteComponentProps<IRouterCustomParams>).
// We also have injected the doc store to access its methods to get doc by slug.
// We can't directly provide the store as a prop though, and later user a get method to define it
interface IRouterCustomParams {
  slug: string
}
interface InjectedProps extends RouteComponentProps<IRouterCustomParams> {
  howtoStore: HowtoStore
  userStore: UserStore
}
interface IState {
  howto?: IHowtoDB
  isLoading: boolean
  changedIsUseful?: boolean
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

@inject('howtoStore', 'userStore')
@observer
export class Howto extends React.Component<
  RouteComponentProps<IRouterCustomParams>,
  IState
> {
  constructor(props: any) {
    super(props)
    this.state = {
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

  /**
   * Local reference to the users count. Avoids waiting for sucessfull server response (fire & forget)
   */
  get localIsUseful(): boolean {
    return typeof this.state.changedIsUseful === 'undefined'
      ? this.store.isActiveHowToUseful
      : this.state.changedIsUseful
  }

  /**
   * Local count for useful votes. Avoids firebase subscrubtion.
   */
  get localVotedUsefulCount(): number {
    if (this.store.howtoStats) {
      // If the user has changed the 'useful' preference locally
      // & it differs to the stored preference the count should increase/decrease by 1
      if (
        typeof this.state.changedIsUseful !== 'undefined' &&
        this.state.changedIsUseful !== this.store.isActiveHowToUseful
      ) {
        return this.state.changedIsUseful
          ? this.store.howtoStats.votedUsefulCount + 1
          : this.store.howtoStats.votedUsefulCount - 1
      }
      return this.store.howtoStats.votedUsefulCount
    }
    return Number(!!this.localIsUseful)
  }

  private moderateHowto = async (accepted: boolean) => {
    const _howto = this.store.activeHowto
    if (_howto) {
      _howto.moderation = accepted ? 'accepted' : 'rejected'
      await this.store.moderateHowto(_howto)
    }
  }

  private onUsefulClick = async (howtoId: string) => {
    this.setState({ changedIsUseful: !this.localIsUseful })
    // Fire & forget
    await this.injected.userStore.updateUsefulHowTos(howtoId)
  }

  public async componentDidMount() {
    const slug = this.props.match.params.slug
    await this.store.setActiveHowtoBySlug(slug)
    this.setState({
      isLoading: false,
    })
  }

  public render() {
    const { isLoading } = this.state
    const loggedInUser = this.injected.userStore.activeUser
    const { activeHowto } = this.store
    if (activeHowto) {
      return (
        <>
          <HowtoDescription
            howto={activeHowto}
            votedUsefulCount={this.localVotedUsefulCount}
            loggedInUser={loggedInUser}
            needsModeration={this.store.needsModeration(activeHowto)}
            isUseful={this.localIsUseful}
            moderateHowto={this.moderateHowto}
            onUsefulClick={() => this.onUsefulClick(activeHowto._id)}
          />
          {/* <HowtoSummary steps={howto.steps} howToSlug={howto.slug} /> */}
          <Box mt={9}>
            {activeHowto.steps.map((step: any, index: number) => (
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
      return isLoading ? <Loader /> : <Route component={NotFoundPage} />
    }
  }
}
