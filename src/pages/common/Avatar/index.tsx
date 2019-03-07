import React from 'react'
import { Image, ImageProps } from 'rebass'
import Icon from 'src/components/Icons'

import { UserStore } from 'src/stores/User/user.store'
import { inject, observer } from 'mobx-react'

interface IInjectedProps extends IProps {
  userStore: UserStore
}

interface IProps {
  userEmail?: string
}

interface IState {
  avatarUrl: string | null
}

type AvatarProps = ImageProps & IProps

@inject('userStore')
@observer
export class Avatar extends React.PureComponent<AvatarProps, IState> {
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
    this.getUserAvatar(this.props.userEmail)
  }

  public getUserAvatar = async (email: string) => {
    try {
      const user = await this.props.userStore.getUserProfile(email)
      this.setState({ avatarUrl: user.avatar })
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
            width={50}
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
