import * as React from 'react'
import { RouteComponentProps } from 'react-router'

import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { BoxContainer } from 'src/components/Layout/BoxContainer'
import { FlexContainer } from 'src/components/Layout/FlexContainer'
import { IUser } from 'src/models/user.models'
import { UserStore } from 'src/stores/User/user.store'
import { Button } from 'src/components/Button'
import Heading from 'src/components/Heading'
import { Flex, Box } from 'rebass'
import { Avatar } from 'src/components/Avatar'
import Text from 'src/components/Text'
import LinearProgress from '@material-ui/core/LinearProgress'
import PageContainer from 'src/components/Layout/PageContainer'
import styled from 'styled-components'
import theme from 'src/themes/styled.theme'
import Icon from 'src/components/Icons'
import { timestampToYear } from 'src/utils/helpers'

interface IRouterCustomParams {
  id: string
}
interface InjectedProps extends RouteComponentProps<IRouterCustomParams> {
  userStore: UserStore
}

interface IState {
  user?: IUser
  isLoading: boolean
}

const BlueCircle = styled(Flex)`
  border-radius: ${theme.radii[4] + 'px'};
  width: 40px;
  height: 40px;
`

@(withRouter as any)
@inject('userStore')
@observer
export class UserPage extends React.Component<
  RouteComponentProps<IRouterCustomParams>,
  IState
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
  public async componentWillMount() {
    const userid = this.props.match.params.id

    const userData = await this.injected.userStore.getUserProfile(userid)
    console.log('userData', userData)
    this.setState({
      user: userData ? userData : undefined,
      isLoading: false,
    })
  }

  public render() {
    const { user, isLoading } = this.state
    if (user) {
      return (
        <BoxContainer>
          <Avatar userName={user.userName} width="120px" borderRadius={5} />
          <Heading large color={'black'} my={3}>
            {user.userName}
          </Heading>
          <Text small color={'grey'}>
            @{user.userName}
          </Text>
          <Flex wrap={'nowrap'} alignItems={'center'}>
            <BlueCircle bg={'blue'} alignItems={'center'} my={3}>
              <Text color={'white'} m={'auto'}>
                C
              </Text>
            </BlueCircle>
            <Heading small inline ml={2} my={0}>
              Community builder
            </Heading>
            {user.year && (
              <Heading small inline color={'grey'} ml={2} my={0}>
                Since {timestampToYear(user.year.seconds)}
              </Heading>
            )}
          </Flex>
          <Text>{user.about}</Text>
          {user.location && (
            <Flex alignItems={'center'}>
              <Icon size={25} glyph={'location-on'} />
              <Heading small m={3}>
                {user.location.value}
              </Heading>
            </Flex>
          )}
          {user.links
            ? user.links.map((link, index) => (
                <Box mt={4}>
                  <Heading large>My Links</Heading>
                  <a href={link.url}>{link.label}</a>
                </Box>
              ))
            : null}
        </BoxContainer>
      )
    } else {
      return isLoading ? <LinearProgress /> : <div>user not found</div>
    }
  }
}
