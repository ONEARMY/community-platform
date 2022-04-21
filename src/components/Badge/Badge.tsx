import { Image, ImageProps } from 'theme-ui'
import { ProfileTypeLabel } from 'src/models/user_pp.models'
import { inject } from 'mobx-react'
import type { ThemeStore } from 'src/stores/Theme/theme.store'
import { Component } from 'react'

import MemberBadge from 'src/assets/images/badges/pt-member.svg'

interface IProps extends ImageProps {
  size?: number
  profileType?: ProfileTypeLabel
  themeStore?: ThemeStore
}
interface IState {
  badgeProfileSrc?: string | null
}
@inject('userStore', 'themeStore')
export class Avatar extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {}
  }

  render() {
    const { badgeProfileSrc } = this.state
    const { size, style } = this.props

    let avatarUrl = badgeProfileSrc || MemberBadge

    if (this.props.themeStore) {
      avatarUrl = this.props.themeStore.currentTheme.badge
    }

    return (
      <>
        <Image
          className="avatar"
          sx={{ width: size ? size : 40, borderRadius: '50%' }}
          height={size ? size : 40}
          src={avatarUrl}
          style={style}
        />
      </>
    )
  }
}
export default Avatar
