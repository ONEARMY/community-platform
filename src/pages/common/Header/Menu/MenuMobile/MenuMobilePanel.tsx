import { Component } from 'react'
import { getAvailablePageList } from 'src/pages/PageList'
import { Box, Flex } from 'theme-ui'
import Profile from 'src/pages/common/Header/Menu/Profile/Profile'
import MenuMobileLink from 'src/pages/common/Header/Menu/MenuMobile/MenuMobileLink'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { getSupportedModules } from 'src/modules'
import { inject } from 'mobx-react'
import type { UserStore } from 'src/stores/User/user.store'

interface IInjectedProps {
  userStore: UserStore
}
@inject('userStore')
export class MenuMobilePanel extends Component {
  constructor(props: any) {
    super(props)
  }

  get injected() {
    return this.props as IInjectedProps
  }

  render() {
    return (
      <>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            zIndex: 3000,
          }}
        >
          <Flex
            as="nav"
            sx={{
              backgroundColor: 'white',
              flexDirection: 'column',
              textAlign: 'center',
              minWidth: '200px',
              boxShadow:
                '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            }}
          >
            {getAvailablePageList(getSupportedModules()).map((page) => {
              const link = (
                <MenuMobileLink
                  path={page.path}
                  content={page.title}
                  key={page.path}
                />
              )
              return page.requiredRole ? (
                <AuthWrapper roleRequired={page.requiredRole} key={page.path}>
                  {link}
                </AuthWrapper>
              ) : (
                link
              )
            })}
            <Profile isMobile={true} user={this.injected?.userStore?.user} />
          </Flex>
        </Box>
      </>
    )
  }
}

export default MenuMobilePanel
