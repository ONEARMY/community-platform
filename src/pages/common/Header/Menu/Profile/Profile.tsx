import { Component } from 'react'
import Foco from 'react-foco'
import type { UserStore } from 'src/stores/User/user.store'
import { inject, observer } from 'mobx-react'
import { Box, Flex } from 'theme-ui'
import { ProfileModal } from 'src/pages/common/Header/Menu/ProfileModal/ProfileModal'
import MenuMobileLink from 'src/pages/common/Header/Menu/MenuMobile/MenuMobileLink'
import ProfileButtons from './ProfileButtons'
import { COMMUNITY_PAGES_PROFILE } from 'src/pages/PageList'
import { MemberBadge } from 'oa-components'

interface IState {
  showProfileModal: boolean
}

interface IProps {
  isMobile: boolean
}

interface IInjectedProps extends IProps {
  userStore: UserStore
}

@inject('userStore')
@observer
export default class Profile extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      showProfileModal: false,
    }
  }
  get injected() {
    return this.props as IInjectedProps
  }

  toggleProfileModal() {
    this.setState({ showProfileModal: !this.state.showProfileModal })
  }

  render() {
    const user = this.injected.userStore.user
    const { showProfileModal } = this.state
    return (
      <>
        {user ? (
          this.props.isMobile ? (
            <Box
              sx={{
                borderBottom: 'none',
                borderColor: 'lightgrey',
                borderTop: '1px solid',
                mt: 1,
              }}
            >
              <MenuMobileLink
                path={'/u/' + user.userName}
                content={'Profile'}
              />
              {COMMUNITY_PAGES_PROFILE.map((page) => (
                <MenuMobileLink
                  path={page.path}
                  key={page.path}
                  content={page.title}
                />
              ))}
              <MenuMobileLink
                path={window.location.pathname}
                content={'Log out'}
                onClick={() => this.injected.userStore.logout()}
              />
            </Box>
          ) : (
            <div data-cy="user-menu">
              <Flex
                onClick={() => this.toggleProfileModal()}
                ml={1}
                sx={{ height: '100%' }}
              >
                <MemberBadge profileType={user.profileType} />
              </Flex>
              <Flex>
                {showProfileModal && (
                  <Foco onClickOutside={() => this.toggleProfileModal()}>
                    <ProfileModal username={user.userName} />
                  </Foco>
                )}
              </Flex>
            </div>
          )
        ) : (
          <ProfileButtons isMobile={this.props.isMobile} />
        )}
      </>
    )
  }
}
