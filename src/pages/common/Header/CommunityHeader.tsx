import React from 'react'
import './Header.scss'
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

export class CommunityHeader extends React.Component<IProps, IState> {
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
            >
              {page.title}
            </NavLink>
          ))}
        </div>
      </div>
    )
  }
}
