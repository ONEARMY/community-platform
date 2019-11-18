import React from 'react'

import { Image, ImageProps } from 'rebass'
import { inject, observer } from 'mobx-react'
import { UserStore, getUserAvatar } from 'src/stores/User/user.store'
import { ProfileTypeLabel, IProfileType } from 'src/models/user_pp.models'
import Workspace from 'src/pages/User/workspace/Workspace'

interface IProps extends ImageProps {
  width?: string
  userName: string
  profileType?: ProfileTypeLabel
}

interface IInjected extends IProps {
  userStore: UserStore
}

interface IState {
  avatarUrl?: string
  fallbackBadge?: string
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
    this.getFallbackImage(this.props.profileType)
  }

  getFallbackImage(type?: ProfileTypeLabel) {
    const img = Workspace.findWorkspaceBadge(type, true)
    this.setState({ fallbackBadge: img })
  }

  async getAvatar(userName: string) {
    const url = getUserAvatar(userName)
    console.log('avatar', url)
    this.setState({ avatarUrl: url })
  }

  render() {
    const { width } = this.props
    const { avatarUrl, fallbackBadge } = this.state

    const addFallbackSrc = (ev: any) => {
      ev.target.src = fallbackBadge
    }

    return (
      <>
        <Image
          className="avatar"
          width={width ? width : 40}
          height={width ? width : 40}
          sx={{ borderRadius: '25px' }}
          src={avatarUrl}
          onError={addFallbackSrc}
        />
      </>
    )
  }
}
