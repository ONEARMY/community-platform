import styled from '@emotion/styled'
import { ReactComponent as IconNotifications } from 'src/assets/icons/icon-notification.svg'
import { Flex } from 'theme-ui'

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
}) => (
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
      <IconNotifications
        color={areThereNotifications ? 'orange' : '#bfbfbf'}
        height="25px"
        width="25px"
      />
    </IconWrapper>
  </>
)
