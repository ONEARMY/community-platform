import React, { useContext } from 'react'
import { getSupportedModules } from 'src/modules'
import { EnvironmentContext } from 'src/pages/common/EnvironmentContext'
import MenuMobileLink from 'src/pages/common/Header/Menu/MenuMobile/MenuMobileLink'
import Profile from 'src/pages/common/Header/Menu/Profile/Profile'
import { getAvailablePageList } from 'src/pages/PageList'
import { Box, Flex } from 'theme-ui'

const MenuMobilePanel = () => {
  const env = useContext(EnvironmentContext)

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
        {getAvailablePageList(
          getSupportedModules(env.VITE_SUPPORTED_MODULES || ''),
        ).map((page) => (
          <MenuMobileLink
            path={page.path}
            content={page.title}
            key={page.path}
          />
        ))}
        <Profile isMobile={true} />
      </Flex>
    </Box>
  )
}

export default MenuMobilePanel
