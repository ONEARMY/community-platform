import React from 'react'
import { CommunityHeader } from './CommunityHeader/CommunityHeader'
import { PublicHeader } from './PublicHeader/PublicHeader'
import AppBar from '@material-ui/core/AppBar'

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
        <AppBar position="static">
          {this.props.variant === 'community' ? (
            <CommunityHeader {...{ title, description }} />
          ) : (
            <PublicHeader />
          )}
        </AppBar>
      </div>
    )
  }
}

export default Header
