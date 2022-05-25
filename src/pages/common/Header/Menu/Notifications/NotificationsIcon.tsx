import { Flex } from 'theme-ui'
import { ReactComponent as IconNotifications } from 'src/assets/icons/icon-notification.svg'
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'

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

function NotificationsIcon({
  onCLick,
  isMobileMenuActive,
  areThereNotifications,
}) {
  const [hasUnseenNotifications, setHasUnseenNotifications] = useState<boolean>(
    areThereNotifications,
  )

  // To illuminate the icon when new notifications are passed
  useEffect(() => {
    setHasUnseenNotifications(areThereNotifications)
  }, [areThereNotifications])

  return (
    <>
      <IconWrapper
        data-cy="toggle-notifications-modal"
        ml={1}
        onClick={() => {
          setHasUnseenNotifications(false)
          onCLick()
        }}
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
          color={hasUnseenNotifications ? 'orange' : '#bfbfbf'}
          height="25px"
          width="25px"
        />
      </IconWrapper>
    </>
  )
}

export default NotificationsIcon
