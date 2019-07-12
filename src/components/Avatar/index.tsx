import React from 'react'

import { Image, ImageProps } from 'rebass'
import Icon from 'src/components/Icons'
import { inject, observer } from 'mobx-react'
import { UserStore } from 'src/stores/User/user.store'
import {
  notificationSubscribe,
  notificationUnsubscribeAll,
} from 'src/stores/Notifications/notifications.service'

interface IProps extends ImageProps {
  width?: string
  userName: string
}

interface IInjected extends IProps {
  userStore: UserStore
}

interface IState {
  avatarUrl?: string
  showFallback?: boolean
}

@inject('userStore')
@observer
export class Avatar extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {}
    this.getUserAvatar(this.props.userName)
  }
  get injected() {
    return this.props as IInjected
  }

  // subscribe/unsubscribe from specific user profile message when
  // user updates their avatar (same url so by default will now be aware of change)
  componentDidMount() {
    notificationSubscribe('Profile.Avatar.Updated', () =>
      this.setState({
        showFallback: false,
      }),
    )
  }
  componentWillUnmount() {
    notificationUnsubscribeAll()
  }

  async getUserAvatar(userName: string) {
    const url = await this.injected.userStore.getUserAvatar(userName)
    this.setState({ avatarUrl: url })
  }

  render() {
    return (
      <>
        {this.state.showFallback && <Icon glyph={'account-circle'} />}
        {!this.state.showFallback && this.state.avatarUrl && (
          <Image
            className="avatar"
            width={this.props.width ? this.props.width : 50}
            borderRadius={this.props.borderRadius ? this.props.borderRadius : 4}
            src={this.state.avatarUrl}
            onError={() => {
              // if user image doesn't exist show fallback image instead
              this.setState({ showFallback: true })
            }}
          />
        )}
      </>
    )
  }
}
