import styled from '@emotion/styled'
import { Flex, Image } from 'theme-ui'

import IconNotifications from '../../../../../assets/icons/icon-notification.svg'

const IconWrapper = styled(Flex)`
  display: flex;
  flex-direction: column;
  color: #000;
  width: 100%;
  font-size: 16px;
  padding: 10px;
  cursor: pointer;
`
const orangeFilter =
  'invert(60%) sepia(83%) saturate(928%) hue-rotate(358deg) brightness(100%) contrast(106%)'
const defaultFilter =
  'invert(94%) sepia(2%) saturate(0%) hue-rotate(2deg) brightness(85%) contrast(83%);'

export const NotificationsIcon = ({
  onCLick,
  isMobileMenuActive,
  areThereNotifications,
}) => (
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
    <Image
      src={IconNotifications}
      sx={{
        filter: areThereNotifications ? orangeFilter : defaultFilter,
      }}
      height="25px"
      width="25px"
    />
  </IconWrapper>
)
