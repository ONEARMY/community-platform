import { inject, observer } from 'mobx-react'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Box, Image } from 'rebass/styled-components'
import EventsIcon from 'src/assets/icons/icon-events.svg'
import HowToCountIcon from 'src/assets/icons/icon-how-to.svg'
import VerifiedBadgeIcon from 'src/assets/icons/icon-verified-badge.svg'
import ElWithBeforeIcon from 'src/components/ElWithBeforeIcon'
import Icon from 'src/components/Icons'
import { Link } from 'src/components/Links'
import Loader from 'src/components/Loader'
import { Text } from 'src/components/Text'
import { IUserPP } from 'src/models'
import type { ThemeStore } from 'src/stores/Theme/theme.store'
import { UserStore } from 'src/stores/User/user.store'
import theme from 'src/themes/styled.theme'
import styled from 'styled-components'
import { MemberProfile } from './MemberProfile'
import { SpaceProfile } from './SpaceProfile'
import { logger } from 'src/logger'

interface IRouterCustomParams {
  id: string
}

interface InjectedProps extends RouteComponentProps<IRouterCustomParams> {
  userStore: UserStore,
  themeStore: ThemeStore
}

interface IState {
  user?: IUserPP
  isLoading: boolean
}

interface IProps {}

const UserStatsBox = styled(Box)`
  border: 2px solid black;
  border-radius: ${theme.space[2]}px;
  background-color: ${theme.colors.background};
`

const UserStatsBoxItem = styled.div`
  margin: ${theme.space[2]}px 0;
  display: flex;
  align-items: center;

  &:first-child {
    margin-top: 0;
  }
`

// Comment on 6.05.20 by BG : renderCommitmentBox commented for now, will be reused with #974
export function renderUserStatsBox(user: IUserPP) {
  let howtoCount = 0
  let eventCount = 0
  try {
    howtoCount = Object.keys(user.stats!.userCreatedHowtos).length
    eventCount = Object.keys(user.stats!.userCreatedEvents).length
  } catch (error) {
    // Comment on 12.10.20 by CC: would be nice if user stats had their own display to make conditional
    // logic easier, but for now will just use a try-catch to also fix cases broken on dev during migration attempts
  }

  return (
    <UserStatsBox mt={3} p={2} pb={0}>
      {user.badges?.verified && (
        <UserStatsBoxItem>
          <Image src={VerifiedBadgeIcon} width="22px" height="22px" />
          <Box ml="5px">Verified</Box>
        </UserStatsBoxItem>
      )}
      {user.location?.latlng && (
        <Link color={'black'} to={'/map/#' + user.userName}>
          <UserStatsBoxItem>
            <Icon glyph="location-on" size="22"></Icon>
            <Box ml="5px">{user.location?.country || 'View on Map'}</Box>
          </UserStatsBoxItem>
        </Link>
      )}
      {howtoCount > 0 && (
        <UserStatsBoxItem>
          <ElWithBeforeIcon IconUrl={HowToCountIcon} />
          How-to: {howtoCount}
        </UserStatsBoxItem>
      )}
      {eventCount > 0 && (
        <UserStatsBoxItem>
          <ElWithBeforeIcon IconUrl={EventsIcon} />
          Events: {eventCount}
        </UserStatsBoxItem>
      )}
    </UserStatsBox>
  )
}

// TODO: Replace this logic with a simpler mobx-react hook: https://mobx-react.js.org/recipes-migration
@inject('userStore', 'themeStore')
@observer
export class UserPage extends React.Component<
  RouteComponentProps<IRouterCustomParams>,
  IState,
  IProps
> {
  constructor(props: any) {
    super(props)
    this.state = {
      user: undefined,
      isLoading: true,
    }
  }

  get injected() {
    return this.props as InjectedProps
  }

  /* eslint-disable @typescript-eslint/naming-convention*/
  async UNSAFE_componentWillMount() {
    const userid = this.props.match.params.id
    const userData = await this.injected.userStore.getUserProfile(userid)
    this.setState({
      user: userData || null,
      isLoading: false,
    })
  }

  render() {
    const { user, isLoading } = this.state
    logger.debug('render', user)
    if (isLoading) {
      return <Loader />
    }
    if (!user) {
      return (
        <Text txtcenter mt="50px" width={1}>
          User not found
        </Text>
      )
    }
    return user.profileType === 'member' ? (
      <MemberProfile user={user} />
    ) : (
      <SpaceProfile user={user} />
    )
  }
}
