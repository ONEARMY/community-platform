import { Component } from 'react'
import { getAvailablePageList } from 'src/pages/PageList'
import { Box, Flex } from 'theme-ui'
import Profile from 'src/pages/common/Header/Menu/Profile/Profile'
import MenuMobileLink from 'src/pages/common/Header/Menu/MenuMobile/MenuMobileLink'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { getSupportedModules } from 'src/modules'
import { inject } from 'mobx-react'
import type { ThemeStore } from 'src/stores/Theme/theme.store'

@inject('themeStore')
export class MenuMobilePanel extends Component {
  injected() {
    return this.props as {
      themeStore: ThemeStore
    }
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
            <Profile isMobile={true} />
          </Flex>
        </Box>
      </>
    )
  }
}

export default MenuMobilePanel
