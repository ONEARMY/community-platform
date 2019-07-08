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
import { Flex } from 'rebass'
import { Avatar } from 'src/components/Avatar'
import Text from 'src/components/Text'
import LinearProgress from '@material-ui/core/LinearProgress'

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
        <FlexContainer m={'0'} bg={'inherit'} flexWrap="wrap">
          <BoxContainer bg={'inherit'} p={'0'} width={[1, 1, 2 / 3]}>
            <BoxContainer mb={2}>
              <Heading small bold>
                Your details
              </Heading>
              <Flex alignItems={'center'}>
                <Avatar userName={user.userName} width="60px" />
                <Text inline bold ml={3}>
                  {user.userName}
                </Text>
              </Flex>
            </BoxContainer>
          </BoxContainer>
          {/* post guidelines container */}
          <BoxContainer
            width={[1, 1, 1 / 3]}
            height={'100%'}
            bg="inherit"
            p={0}
            pl={2}
          >
            <Button
              // onClick={() => handleSubmit()}
              width={1}
              mt={3}
              variant={'secondary'}
              // variant={disabled ? 'disabled' : 'secondary'}
              // disabled={submitting || invalid}
            >
              save profile
            </Button>
          </BoxContainer>
        </FlexContainer>
      )
    } else {
      return isLoading ? <LinearProgress /> : <div>user not found</div>
    }
  }
}
