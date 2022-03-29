import { Component } from 'react'

import { Image, ImageProps } from 'theme-ui'
import { inject, observer } from 'mobx-react'
import { ProfileTypeLabel } from 'src/models/user_pp.models'
import Workspace from 'src/pages/User/workspace/Workspace'
import type { ThemeStore } from 'src/stores/Theme/theme.store'

import MemberBadge from 'src/assets/images/badges/pt-member.svg'
import { THEME_LIST } from 'src/themes'

interface IProps extends ImageProps {
  width?: string
  profileType?: ProfileTypeLabel
  themeStore?: ThemeStore
}

interface IState {
  badgeProfileSrc?: string | null
}

@inject('userStore', 'themeStore')
@observer
export class Avatar extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {}
  }

  // subscribe/unsubscribe from specific user profile message when
  // user updates their avatar (same url so by default will now be aware of change)
  componentDidMount() {
    this.getProfileTypeBadge(this.props.profileType)
  }

  public getProfileTypeBadge(type?: ProfileTypeLabel) {
    const {width} = this.props;
    const img = Workspace.findWorkspaceBadgeNullable(type, Number(width || 0) < 50)
    this.setState({ badgeProfileSrc: img })
  }
  render() {
    const { width } = this.props
    const { badgeProfileSrc } = this.state

    let avatarUrl = badgeProfileSrc || MemberBadge;

    const th = this.props?.themeStore?.currentTheme

    /**
     * 🚨🚨🚨🚨🚨🚨
     * 
     *  HACKY WORKAROUND
     * 
     *  For the second instance (Project Kamp)
     *  there are no membership levels or variations
     *  to the membership type.
     * 
     *  So that means we _always_ want the default badge
     *  bundled with the PlatformTheme.
     * 
     * 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
     */

    if ( this.props.themeStore && th?.id === THEME_LIST.PROJECT_KAMP) {
      avatarUrl = width && parseInt(width, 10) >= 100 ? this.props.themeStore?.currentTheme.badge : this.props.themeStore.currentTheme.avatar;
    }


    return (
      <>
        <Image
          className="avatar"
          sx={{width: width ? width : 40, borderRadius: '25px'}}
          height={width ? width : 40}
          src={avatarUrl}
        />
      </>
    )
  }
}
