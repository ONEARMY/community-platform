import { NotificationList } from 'oa-components';
import theme from 'src/themes/styled.theme';
import { Box } from 'theme-ui';

import styled from '@emotion/styled';

import type { UserNotificationList } from 'oa-components'
const PanelContainer = styled(Box)`
  width: 100%;
  position: absolute;
  left: 0;
  right: 0;
  display: block;
  z-index: ${theme.zIndex.header};
  height: 100%;
`

const PanelMenu = styled(Box)`
  background-color: ${theme.colors.white};
  display: flex;
  justify-content: flex-end;
  align-items: center;
  display: block !important;
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  overflow: visible;
  min-width: 200px;
`
export const PanelItem = styled(Box as any)`
  padding: ${theme.space[3]}px 0px;
`

export const MenuMobileLinkContainer = styled(Box as any)`
  border-top: 1px solid ${theme.colors.lightgrey};
  border-bottom: 1px solid ${theme.colors.lightgrey};
  margin-top: 5px;
`

export interface Props {
  notifications: UserNotificationList
  markAllRead: () => void
  markAllNotified: () => void
}

export const NotificationsMobile = (props: Props) => {
  const { notifications, markAllRead, markAllNotified } = props

  return (
    <PanelContainer>
      <PanelMenu>
        <NotificationList
          notifications={notifications}
          markAllNotified={markAllNotified}
          markAllRead={() => markAllRead && markAllRead()}
          sx={{
            position: 'absolute',
            left: 1,
            right: 1,
          }}
        />
      </PanelMenu>
    </PanelContainer>
  )
}
