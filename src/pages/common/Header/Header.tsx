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
}

export class Header extends React.Component<IProps, IState> {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div id="header">
        <AppBar position="static">
          {this.props.variant === 'community' ? (
            <CommunityHeader />
          ) : (
            <PublicHeader />
          )}
        </AppBar>
      </div>
    )
  }
}

export default Header
