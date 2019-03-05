import React from 'react'
import {
    COMMUNITY_PAGES,
    COMMUNITY_PAGES_MORE,
    COMMUNITY_PAGES_PROFILE, HOME_PAGE,
} from 'src/pages'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import IconButton from '@material-ui/core/IconButton'
import MailOutlinedIcon from '@material-ui/icons/MailOutlined'
import {MdNotifications} from 'react-icons/md'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import {LoginComponent} from '../../Login/Login'
import {
    Content,
    LogoText,
    Logo,
    Links,
    Profile,
    ListButton,
    LinkButton,
    Avatar,
    SectionDescription,
} from './elements'
import {IUser} from 'src/models/user.models'
import {UserStore} from 'src/stores/User/user.store'
import {inject, observer} from 'mobx-react'

interface IState {
    moreMenuAnchor: any
    profileMenuAnchor: any
}

interface IProps {
    title: string
    description: string
}

interface IInjectedProps extends IProps {
    userStore: UserStore
}

@inject('userStore')
@observer
export class CommunityHeader extends React.Component<IProps, IState> {
    state = {
        moreMenuAnchor: null,
        profileMenuAnchor: null,
    };

    get props() {
        return this.props as IInjectedProps
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
        this.setState({moreMenuAnchor: null})
    }
    closeProfileMenu = () => {
        this.setState({profileMenuAnchor: null})
    }
    getProfile = (user: IUser) => {
        return (
            <Profile onClick={this.openProfileMenu}>
                <Avatar
                    alt={user.display_name}
                    src="http://i.pravatar.cc/200"
                    className="header__avatar"
                />
                <KeyboardArrowDownIcon/>
            </Profile>
        )
    }

    logout() {
        this.props.userStore.logout()
        this.closeProfileMenu()
    }

    render() {
        const {moreMenuAnchor, profileMenuAnchor} = this.state;
        return (
            <div>
                <Content>
                    <LogoText>One Army</LogoText>
                    <Logo src="https://pngimage.net/wp-content/uploads/2018/06/logo-placeholder-png.png"/>
                    {this.props.userStore.user ?
                        <React.Fragment>
                            <Links>
                                {COMMUNITY_PAGES.map((page, index) => (
                                    <LinkButton
                                        className="nav-link"
                                        to={page.path}
                                        activeClassName="link-active"
                                        key={`community-link-${index}`}
                                    >
                                        {page.title}
                                    </LinkButton>
                                ))}
                                <ListButton
                                    className="nav-link"
                                    variant="text"
                                    onClick={this.openMoreMenu}
                                >
                                    More
                                </ListButton>
                                <Menu
                                    open={moreMenuAnchor ? true : false}
                                    anchorEl={moreMenuAnchor}
                                    className="nav__more-menu"
                                    style={{marginTop: '3em'}}
                                >
                                    <ClickAwayListener onClickAway={this.closeMoreMenu}>
                                        <div>
                                            {COMMUNITY_PAGES_MORE.map(page => (
                                                <MenuItem onClick={this.closeMoreMenu} key={page.path}>
                                                    <LinkButton
                                                        className="nav-link"
                                                        to={page.path}
                                                        activeClassName="link-active"
                                                    >
                                                        {page.title}
                                                    </LinkButton>
                                                </MenuItem>
                                            ))}
                                        </div>
                                    </ClickAwayListener>
                                </Menu>
                            </Links>
                            <IconButton component="span">
                                <MailOutlinedIcon/>
                            </IconButton>
                            <IconButton component="span">
                                <MdNotifications/>
                            </IconButton>
                            <Profile onClick={this.openProfileMenu}>
                                <Avatar
                                    alt="Remy Sharp"
                                    src="http://i.pravatar.cc/200"
                                    className="header__avatar"
                                />
                                <KeyboardArrowDownIcon/>
                            </Profile>
                            <Menu
                                open={profileMenuAnchor ? true : false}
                                anchorEl={profileMenuAnchor}
                                className="nav__more-menu"
                                style={{marginTop: '3em'}}
                            >
                                <ClickAwayListener onClickAway={this.closeProfileMenu}>
                                    <div>
                                        {COMMUNITY_PAGES_PROFILE.map(page => (
                                            <MenuItem onClick={this.closeProfileMenu} key={page.path}>
                                                <LinkButton
                                                    className="nav-link"
                                                    to={page.path}
                                                    activeClassName={'link-active'}
                                                >
                                                    {page.title}
                                                </LinkButton>
                                            </MenuItem>
                                        ))}
                                        <MenuItem onClick={() => this.logout()}>Logout</MenuItem>
                                        <MenuItem onClick={this.closeProfileMenu}>
                                            Main Site
                                        </MenuItem>
                                    </div>
                                </ClickAwayListener>
                            </Menu>
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <Links>
                                {HOME_PAGE.map((page, index) => (
                                    <LinkButton
                                        className="nav-link"
                                        to={page.path}
                                        activeClassName="link-active"
                                        key={`community-link-${index}`}
                                    >
                                        {page.title}
                                    </LinkButton>
                                ))}
                            </Links>
                            <LoginComponent user={this.props.userStore.user}/>
                        </React.Fragment>
                    }
                </Content>
                <SectionDescription>
                    {this.props.title}
                    {this.props.description}
                </SectionDescription>
            </div>
        )
    }
}
