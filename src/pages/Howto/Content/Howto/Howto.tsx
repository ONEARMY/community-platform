import * as React from 'react'
import type { RouteComponentProps } from 'react-router'
import { Redirect } from 'react-router'
import { inject, observer } from 'mobx-react'
import type { HowtoStore } from 'src/stores/Howto/howto.store'
import HowtoDescription from './HowtoDescription/HowtoDescription'
import Step from './Step/Step'
import type { IHowtoDB } from 'src/models/howto.models'
import { Box, Flex, Text } from 'theme-ui'
import { Button } from 'oa-components'
import styled from '@emotion/styled'
import theme from 'src/themes/styled.theme'
import WhiteBubble0 from 'src/assets/images/white-bubble_0.svg'
import WhiteBubble1 from 'src/assets/images/white-bubble_1.svg'
import WhiteBubble2 from 'src/assets/images/white-bubble_2.svg'
import WhiteBubble3 from 'src/assets/images/white-bubble_3.svg'
import { Loader } from 'src/components/Loader'
import type { UserStore } from 'src/stores/User/user.store'
import { HowToComments } from './HowToComments/HowToComments'
import type { AggregationsStore } from 'src/stores/Aggregations/aggregations.store'
import { Link } from 'react-router-dom'
// The parent container injects router props along with a custom slug parameter (RouteComponentProps<IRouterCustomParams>).
// We also have injected the doc store to access its methods to get doc by slug.
// We can't directly provide the store as a prop though, and later user a get method to define it
interface IRouterCustomParams {
  slug: string
}
interface InjectedProps extends RouteComponentProps<IRouterCustomParams> {
  howtoStore: HowtoStore
  userStore: UserStore
  aggregationsStore: AggregationsStore
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
    z-index: ${theme.zIndex.behind};
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

@inject('howtoStore', 'userStore', 'aggregationsStore')
@observer
export class Howto extends React.Component<
  RouteComponentProps<IRouterCustomParams>,
  IState
> {
  //TODO: Typing Props
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

  private moderateHowto = async (accepted: boolean) => {
    const _howto = this.store.activeHowto
    if (_howto) {
      _howto.moderation = accepted ? 'accepted' : 'rejected'
      await this.store.moderateHowto(_howto)
    }
  }

  private onUsefulClick = async (
    howtoId: string,
    howtoCreatedBy: string,
    howToSlug: string,
  ) => {
    // Trigger update without waiting
    const { userStore } = this.injected
    userStore.updateUsefulHowTos(howtoId, howtoCreatedBy, howToSlug)
    // Make an optimistic update of current aggregation to update UI
    const { aggregationsStore } = this.injected
    const votedUsefulCount =
      aggregationsStore.aggregations.users_votedUsefulHowtos![howtoId] || 0
    const hasUserVotedUseful = this.store.userVotedActiveHowToUseful
    aggregationsStore.overrideAggregationValue('users_votedUsefulHowtos', {
      [howtoId]: votedUsefulCount + (hasUserVotedUseful ? -1 : 1),
    })
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
      const { aggregations } = this.injected.aggregationsStore
      // Distinguish between undefined aggregations (not loaded) and undefined aggregation (no votes)
      const votedUsefulCount = aggregations.users_votedUsefulHowtos
        ? aggregations.users_votedUsefulHowtos[activeHowto._id] || 0
        : undefined

      const activeHowToComments = this.store.getActiveHowToComments()

      return (
        <>
          <HowtoDescription
            howto={activeHowto}
            votedUsefulCount={votedUsefulCount}
            loggedInUser={loggedInUser}
            needsModeration={this.store.needsModeration(activeHowto)}
            hasUserVotedUseful={this.store.userVotedActiveHowToUseful}
            moderateHowto={this.moderateHowto}
            onUsefulClick={() =>
              this.onUsefulClick(
                activeHowto._id,
                activeHowto._createdBy,
                activeHowto.slug,
              )
            }
          />
          <Box mt={9}>
            {activeHowto.steps.map((step: any, index: number) => (
              <Step step={step} key={index} stepindex={index} />
            ))}
          </Box>
          <HowToComments
            comments={activeHowToComments}
            commentToScrollTo={this.props.location.hash.replace(
              '#comment_',
              '',
            )}
          />
          <MoreBox py={20} mt={20}>
            <Text
              sx={{
                fontSize: [4, 4, 5],
                display: 'block',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              You're done.
              <br />
              Nice one!
            </Text>
            <Flex sx={{ justifyContent: 'center' }} mt={2}>
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
        <Redirect
          to={{
            pathname: '/how-to',
            search:
              '?search=' +
              (this.props?.match?.params?.slug).replace(/\-/gi, ' ') +
              '&source=how-to-not-found',
          }}
        />
      )
    }
  }
}
