import { Flex } from 'theme-ui'
import styled from '@emotion/styled'

const IconWrapper = styled(Flex)`
  display: flex;
  flex-direction: column;
  color: #000;
  width: 100%;
  font-size: 16px;
  padding: 10px;
  cursor: pointer;
`

export const NotificationsIcon = ({
  onCLick,
  isMobileMenuActive,
  areThereNotifications,
}: any) => (
  <>
    <IconWrapper
      data-cy="toggle-notifications-modal"
      ml={1}
      onClick={onCLick}
      style={
        isMobileMenuActive
          ? {
              backgroundColor: '#e2edf7',
              borderRadius: '5px',
            }
          : {}
      }
    >
      console.log(`TODO:`, {areThereNotifications})
      {/* <IconNotifications
        color={areThereNotifications ? 'orange' : '#bfbfbf'}
        height="25px"
        width="25px"
      /> */}
    </IconWrapper>
  </>
)
