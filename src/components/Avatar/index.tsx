import { Component } from 'react'

import { Image, ImageProps } from 'rebass/styled-components'
import { inject, observer } from 'mobx-react'
import { ProfileTypeLabel } from 'src/models/user_pp.models'
import Workspace from 'src/pages/User/workspace/Workspace'

interface IProps extends ImageProps {
  width?: string
  profileType?: ProfileTypeLabel
}

interface IState {
  badgeProfileType?: string
}

@inject('userStore')
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
    const img = Workspace.findWorkspaceBadge(type, true)
    this.setState({ badgeProfileType: img })
  }
  render() {
    const { width } = this.props
    const { badgeProfileType } = this.state

    return (
      <Image
        className="avatar"
        width={width ? width : 40}
        height={width ? width : 40}
        sx={{ borderRadius: '25px' }}
        src={badgeProfileType}
      />
    )
  }
}
