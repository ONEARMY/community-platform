import Flex from 'src/components/Flex'
import { ReactComponent as IconNotifications } from 'src/assets/icons/icon-notification.svg'
import styled from '@emotion/styled'


const IconWrapper = styled(Flex)`
  display: flex;
  flex-direction: column;
  color: #000;
  width: 100%;
  font-size: 16px;
  padding: 10px; 
  cursor: pointer;
  
  }
`

function NotificationsIcon({ onCLick, isMobileMenuActive, areThereNotifications }) {
    return (
        <>
            <IconWrapper data-cy="toggle-notifications-modal" ml={1} onClick={onCLick} style={isMobileMenuActive ? {
                backgroundColor: "#e2edf7", borderRadius: "5px"
            } : {}}>
                <IconNotifications color={areThereNotifications ? "orange" : "#bfbfbf"} height="25px" width="25px" />
            </IconWrapper>
        </>
    )
}

export default NotificationsIcon
