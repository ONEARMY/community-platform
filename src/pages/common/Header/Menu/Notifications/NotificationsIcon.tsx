import styled from '@emotion/styled'
import { Icon } from 'oa-components'
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
      <Icon
        glyph={areThereNotifications ? 'thunderbolt' : 'thunderbolt-grey'}
        size={25}
      />
    </IconWrapper>
  </>
)
