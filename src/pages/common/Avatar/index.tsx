import React from 'react'
import { Image, ImageProps } from 'rebass'
import Icon from 'src/components/Icons'
import { UserStore } from 'src/stores/User/user.store'
import { inject, observer } from 'mobx-react'

interface IInjectedProps extends IProps {
  userStore: UserStore
}

interface IProps {
  userId?: string
  width?: string
}

interface IState {
  avatarUrl: string | null
}

type AvatarProps = ImageProps & IProps

@inject('userStore')
@observer
export class Avatar extends React.Component<AvatarProps, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      avatarUrl: null,
    }
  }
  get props() {
    return this.props as IInjectedProps
  }

  componentWillMount() {
    this.getUserAvatar(this.props.userId)
  }

  public getUserAvatar = async (userId: string) => {
    try {
      if (userId !== 'anonymous') {
        const user = await this.props.userStore.getUserProfile(userId)
        this.setState({ avatarUrl: user.avatar })
      }
    } catch (error) {
      console.log('err', error)
      throw new Error(JSON.stringify(error))
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
