import React from 'react'
import { CommunityHeader } from './CommunityHeader/CommunityHeader'
import { PublicHeader } from './PublicHeader/PublicHeader'

interface IState {
  auth: boolean
  anchorEl: any
  isLoggedIn?: boolean
}

interface IProps {
  variant: 'community' | 'public'
  title: string
  description: string
}

export class Header extends React.Component<IProps, IState> {
  constructor(props) {
    super(props)
  }

  render() {
    const { title, description } = this.props
    return (
      <div id="header">
        {this.props.variant === 'community' ? (
          <CommunityHeader {...{ title, description }} />
        ) : (
          <PublicHeader />
        )}
      </div>
    )
  }
}

export default Header
