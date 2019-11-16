import React from 'react'

import { Image, ImageProps } from 'rebass'
import Icon from 'src/components/Icons'
import { inject, observer } from 'mobx-react'
import { UserStore, getUserAvatar } from 'src/stores/User/user.store'
import { ProfileTypeLabel, IProfileType } from 'src/models/user_pp.models'
import { UserPage } from 'src/pages/User/content/UserPage/UserPage'

interface IProps extends ImageProps {
  width?: string
  userName: string
  // profileType: ProfileTypeLabel
}

interface IInjected extends IProps {
  userStore: UserStore
}

interface IState {
  avatarUrl?: string
  fallbackBadge?: IProfileType
  showFallback?: boolean
}

@inject('userStore')
@observer
export class Avatar extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {}
  }
  get injected() {
    return this.props as IInjected
  }

  // subscribe/unsubscribe from specific user profile message when
  // user updates their avatar (same url so by default will now be aware of change)
  componentDidMount() {
    this.getAvatar(this.props.userName)
  }

  // async getFallbackBadge() {
  //   findWorkspaceBadge
  // }

  async getAvatar(userName: string) {
    const url = getUserAvatar(userName)
    console.log('avatar', url)
    this.setState({ avatarUrl: url })
  }

  render() {
    const { width } = this.props
    const { showFallback, avatarUrl } = this.state
    return (
      <>
        {/* {showFallback && <Icon glyph={'account-circle'} size={50} />} */}
        {/* {!showFallback && avatarUrl && ( */}
        <Image
          className="avatar"
          width={width ? width : 40}
          sx={{ borderRadius: '25px' }}
          src={avatarUrl}
          // onError={}
        />
        {/* )} */}
      </>
    )
  }
}
