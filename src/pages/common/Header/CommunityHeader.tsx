import React from 'react'
import './Header.scss'
import {
  COMMUNITY_PAGES,
  COMMUNITY_PAGES_MORE,
  COMMUNITY_PAGES_PROFILE,
} from 'src/pages'
import { NavLink } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import IconButton from '@material-ui/core/IconButton'
import MailOutlinedIcon from '@material-ui/icons/MailOutlined'
import { MdNotifications } from 'react-icons/md'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import Avatar from '@material-ui/core/Avatar'

interface IState {
  moreMenuAnchor: any
  profileMenuAnchor: any
}

export class CommunityHeader extends React.Component<any, IState> {
  constructor(props) {
    super(props)
    this.state = {
      moreMenuAnchor: null,
      profileMenuAnchor: null,
    }
  }

  // function receives clicked element which then sets itself as an 'anchor'
  // for displaying the dropdown menu
  openMoreMenu = (e: React.MouseEvent) => {
    this.setState({
      moreMenuAnchor: e.currentTarget,
    })
  }
  openProfileMenu = (e: React.MouseEvent) => {
    this.setState({
      profileMenuAnchor: e.currentTarget,
    })
  }
  closeMoreMenu = () => {
    this.setState({ moreMenuAnchor: null })
  }
  closeProfileMenu = () => {
    this.setState({ profileMenuAnchor: null })
  }

  render() {
    const { moreMenuAnchor, profileMenuAnchor } = this.state
    return (
      <div id="communityHeader" className="header__content">
        <div className="header__logo-text">One Army</div>
        <div style={{ position: 'relative' }}>
          <img
            className="header__logo-image"
            src="https://pngimage.net/wp-content/uploads/2018/06/logo-placeholder-png.png"
          />
          <div className="community-badge">Community Placeholder</div>
        </div>
        <div className="header__nav-links">
          {COMMUNITY_PAGES.map(page => (
            <NavLink
              className="nav-link"
              to={page.path}
              activeClassName="link-active"
              key={page.path}
            >
              {page.title}
            </NavLink>
          ))}
          <Button
            className="nav-link"
            variant="text"
            onClick={this.openMoreMenu}
            // onMouseEnter={this.openMenu}
            // onMouseLeave={this.closeMenu}
          >
            More
          </Button>
          <Menu
            open={moreMenuAnchor ? true : false}
            anchorEl={moreMenuAnchor}
            className="nav__more-menu"
            style={{ marginTop: '3em' }}
          >
            <ClickAwayListener onClickAway={this.closeMoreMenu}>
              <div>
                {COMMUNITY_PAGES_MORE.map(page => (
                  <MenuItem onClick={this.closeMoreMenu} key={page.path}>
                    <NavLink
                      className="nav-link"
                      to={page.path}
                      activeClassName="link-active"
                    >
                      {page.title}
                    </NavLink>
                  </MenuItem>
                ))}
              </div>
            </ClickAwayListener>
          </Menu>
        </div>
        <div className="header__nav-buttons">
          <IconButton component="span">
            <MailOutlinedIcon />
          </IconButton>
          <IconButton component="span">
            <MdNotifications />
          </IconButton>
        </div>
        <div
          className="profile__menu-container"
          style={{ display: 'flex' }}
          onClick={this.openProfileMenu}
        >
          <Avatar
            alt="Remy Sharp"
            src="http://i.pravatar.cc/200"
            className="header__avatar"
          />
          <KeyboardArrowDownIcon />
        </div>
        <Menu
          open={profileMenuAnchor ? true : false}
          anchorEl={profileMenuAnchor}
          className="nav__more-menu"
          style={{ marginTop: '3em' }}
        >
          <ClickAwayListener onClickAway={this.closeProfileMenu}>
            <div>
              {COMMUNITY_PAGES_PROFILE.map(page => (
                <MenuItem onClick={this.closeProfileMenu} key={page.path}>
                  <NavLink
                    className="nav-link"
                    to={page.path}
                    activeClassName="link-active"
                  >
                    {page.title}
                  </NavLink>
                </MenuItem>
              ))}
              <MenuItem onClick={this.closeProfileMenu}>Logout</MenuItem>
              <MenuItem onClick={this.closeProfileMenu}>Main Site</MenuItem>
            </div>
          </ClickAwayListener>
        </Menu>
      </div>
    )
  }
}
