import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Icon from 'src/components/Icons'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import { VersionNumber } from 'src/components/VersionNumber/VersionNumber'
import { COMMUNITY_PAGES } from 'src/pages'
import { NavLink } from 'react-router-dom'

interface IState {
  auth: boolean
  anchorEl: any
  isLoggedIn?: boolean
}

interface IProps {
  title?: string
}

export class PublicHeader extends React.Component<IProps, IState> {
  constructor(props) {
    super(props)
    this.state = {
      auth: true,
      anchorEl: null,
    }
  }

  handleChange = event => {
    this.setState({ auth: event.target.checked })
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  render() {
    const { auth, anchorEl } = this.state
    const open = Boolean(anchorEl)
    return (
      <div id="header">
        <div className="container">
          {/* <LoginContainer />
          {this.state && this.state.isLoggedIn ? (
            <div>User Logged in page</div>
          ) : (
            <div className="bgimg-1" />
          )} */}
          <VersionNumber />
          <AppBar position="static">
            <Toolbar>
              {/* <IconButton color="inherit" aria-label="Menu">
                <MenuIcon />
              </IconButton> */}

              {COMMUNITY_PAGES.map(page => (
                <NavLink to={page.path} activeClassName="link-active">
                  {page.title}
                  <Menu open={Boolean(anchorEl)}>
                    <MenuItem onClick={this.handleClose}>Menu Item</MenuItem>
                  </Menu>
                </NavLink>
              ))}
              {auth && (
                <div>
                  <IconButton
                    aria-owns={open ? 'menu-appbar' : undefined}
                    aria-haspopup="true"
                    onClick={this.handleMenu}
                    color="inherit"
                  >
                    <Icon glyph={'account-circle'} />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={open}
                    onClose={this.handleClose}
                  >
                    <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                    <MenuItem onClick={this.handleClose}>My account</MenuItem>
                  </Menu>
                </div>
              )}
            </Toolbar>
          </AppBar>
        </div>
      </div>
    )
  }
}
