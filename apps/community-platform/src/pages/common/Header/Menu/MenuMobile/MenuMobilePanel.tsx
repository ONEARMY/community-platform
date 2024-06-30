import React from 'react'
import { Box, Flex } from 'theme-ui'

import { AuthWrapper } from '../../../../../common/AuthWrapper'
import { getSupportedModules } from '../../../../../modules'
import { getAvailablePageList } from '../../../../../pages/PageList'
import Profile from '../Profile/Profile'
import MenuMobileLink from './MenuMobileLink'

const MenuMobilePanel = () => {
  return (
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
  )
}

export default MenuMobilePanel
