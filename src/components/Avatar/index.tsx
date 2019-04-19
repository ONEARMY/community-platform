import React from 'react'
import { Image, ImageProps } from 'rebass'
import Icon from 'src/components/Icons'
import { inject, observer } from 'mobx-react'
import { UserStore } from 'src/stores/User/user.store'

interface IProps extends ImageProps {
  url?: string
  width?: string
  userId?: string
}

interface IInjected extends IProps {
  userStore: UserStore
}

interface IState {
  avatarUrl: string | null
}

@inject('userStore')
@observer
export class Avatar extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      avatarUrl: this.props.url ? this.props.url : null,
    }
    if (!this.state.avatarUrl && this.props.userId) {
      this.getUserAvatar(this.props.userId)
    }
  }
  get injected() {
    return this.props as IInjected
  }

  async getUserAvatar(userId: string) {
    const profile = await this.injected.userStore.getUserProfile(userId)
    if (profile && profile.avatar_thumb) {
      this.setState({ avatarUrl: profile.avatar_thumb })
    }
  }

  render() {
    const avatarUrl = this.state.avatarUrl
    return (
      <>
        {avatarUrl ? (
          <Image
            className="avatar"
            width={this.props.width ? this.props.width : 50}
            borderRadius={4}
            src={avatarUrl}
          />
        ) : (
          <Icon glyph={'account-circle'} />
        )}
      </>
    )
  }
}
