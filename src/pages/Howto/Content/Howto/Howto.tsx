import * as React from 'react'
import { RouteComponentProps } from 'react-router'
// TODO add loader (and remove this material-ui dep)
import Heading from 'src/components/Heading'
import { inject } from 'mobx-react'
import { HowtoStore } from 'src/stores/Howto/howto.store'
import HowtoDescription from './HowtoDescription/HowtoDescription'
import Step from './Step/Step'
import { IHowtoDB } from 'src/models/howto.models'
// import HowtoSummary from './HowtoSummary/HowtoSummary'
import Text from 'src/components/Text'
import { Box, Flex } from 'rebass'
import { Button } from 'src/components/Button'
import styled from 'styled-components'
import theme from 'src/themes/styled.theme'
import WhiteBubble0 from 'src/assets/images/white-bubble_0.svg'
import WhiteBubble1 from 'src/assets/images/white-bubble_1.svg'
import WhiteBubble2 from 'src/assets/images/white-bubble_2.svg'
import WhiteBubble3 from 'src/assets/images/white-bubble_3.svg'
import { IUser } from 'src/models/user.models'
import { Link } from 'src/components/Links'

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
  loggedInUser: IUser | undefined
}
const MoreBox = styled(Box)`
  position: relative;
  &:after {
    content: '';
    background-image: url(${WhiteBubble0});
    width: 100%;
    height: 100%;
    z-index: -1;
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
export class Howto extends React.Component<
  RouteComponentProps<IRouterCustomParams>,
  IState
> {
  constructor(props: any) {
    super(props)
    this.state = {
      howto: undefined,
      isLoading: true,
      loggedInUser: undefined,
    }
  }
  // workaround used later so that userStore can be called in render method when not existing on
  get injected() {
    return this.props as InjectedProps
  }

  public async componentWillMount() {
    const slug = this.props.match.params.slug
    const doc = await this.injected.howtoStore.getDocBySlug(slug)
    const loggedInUser = this.injected.howtoStore.activeUser
    this.setState({
      howto: doc,
      isLoading: false,
      loggedInUser: loggedInUser ? loggedInUser : undefined,
    })
  }

  public render() {
    const { howto, isLoading, loggedInUser } = this.state
    if (howto) {
      return (
        <>
          <HowtoDescription howto={howto} loggedInUser={loggedInUser} />
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
                <Button variant={'secondary'}>Back</Button>
              </Link>
            </Flex>
          </MoreBox>
        </>
      )
    } else {
      return isLoading ? (
        <Flex>
          <Heading auxiliary txtcenter width={1}>
            loading...
          </Heading>
        </Flex>
      ) : (
        <div>How-to not found</div>
      )
    }
  }
}
