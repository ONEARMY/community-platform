import { Box, Flex } from 'theme-ui'
import { Profile } from '../Profile/Profile'
import { MenuMobileLink } from './MenuMobileLink'

export const MenuMobilePanel = (getAvailablePageList: any) => {
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
          {getAvailablePageList.map((page: any) => {
            return (
              <MenuMobileLink
                path={page.path}
                content={page.title}
                key={page.path}
              />
            )
          })}
          <Profile isMobile={true} />
        </Flex>
      </Box>
    </>
  )
}
