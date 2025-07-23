import { useContext } from 'react'
import { ButtonIcon, Icon, NotificationsModal } from 'oa-components'
import { getSupportedModules } from 'src/modules'
import { getAvailablePageList } from 'src/pages/PageList'
import { Box, Flex } from 'theme-ui'

import { EnvironmentContext } from '../../EnvironmentContext'
import { MenusContext } from '../MenusContext'
import MenuMobileLink from './MenuMobileLink'

interface IProps {
  isOpen: boolean
  onOpen: () => void
}

export const MenuMobile = (props: IProps) => {
  const env = useContext(EnvironmentContext)
  const menusContext = useContext(MenusContext)

  const { isOpen, onOpen } = props

  return (
    <Box sx={{ display: ['block', 'block', 'none'] }}>
      <Icon
        glyph="menu"
        onClick={() => (isOpen ? menusContext.closeAll() : onOpen())}
        sx={{
          size: 40,
          sx: {
            ':hover': {
              background: 'background',
              borderRadius: 99,
            },
          },
        }}
      />

      <NotificationsModal isOpen={isOpen}>
        <Flex>
          <Flex
            as="nav"
            sx={{
              flex: 1,
              flexDirection: 'column',
              textAlign: 'center',
              minWidth: '200px',
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
          </Flex>

          <ButtonIcon
            icon="close"
            onClick={menusContext.closeAll}
            sx={{
              border: 'none',
              paddingLeft: 2,
              paddingRight: 3,
            }}
          />
        </Flex>
      </NotificationsModal>
    </Box>
  )
}
