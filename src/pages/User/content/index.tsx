import { inject, observer } from 'mobx-react'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import Loader from 'src/components/Loader'
import { Text } from 'src/components/Text'
import { IUserPP } from 'src/models'
import type { ThemeStore } from 'src/stores/Theme/theme.store'
import { UserStore } from 'src/stores/User/user.store'
import { MemberProfile } from './MemberProfile'
import { SpaceProfile } from './SpaceProfile'
import { logger } from 'src/logger'
import { AdminContact } from 'src/components/AdminContact/AdminContact'
import { AuthWrapper } from 'src/components/Auth/AuthWrapper'

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
        <Text txtcenter mt="50px" sx={{width: '100%'}}>
          User not found
        </Text>
      )
    }
    return user.profileType === 'member' ? (
      <MemberProfile user={user} adminButton={ <AuthWrapper roleRequired={'admin'}>
      <AdminContact user={user}/>
    </AuthWrapper>}/>
    ) : (
      <SpaceProfile user={user}
      adminButton={
        <AuthWrapper roleRequired={'admin'}>
          <AdminContact user={user}/>
        </AuthWrapper>
      }
        />
    )
  }
}
