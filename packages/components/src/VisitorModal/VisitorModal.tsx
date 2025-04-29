import { ButtonIcon, Modal } from 'oa-components'
import { Flex, Text } from 'theme-ui'

import { iconMap } from '../Icon/svgs'

import type { IUser, UserVisitorPreferencePolicy } from 'oa-shared'
import type { JSX } from 'react'
import { Button } from '../Button/Button'
import { Icon } from '../Icon/Icon'

interface DisplayData {
  icon: JSX.Element
  label: string
  default: string
}

export const visitorDisplayData = new Map<
  UserVisitorPreferencePolicy,
  DisplayData
>([
  [
    'open',
    {
      icon: iconMap.visitorsOpen,
      label: 'Open to visitors',
      default: 'This space welcomes visitors.',
    },
  ],
  [
    'appointment',
    {
      icon: iconMap.visitorsAppointment,
      label: 'Visitors after appointment',
      default:
        'This space prefers an appointment before visiting it. See their contact options, or get in touch directly!',
    },
  ],
  [
    'closed',
    {
      icon: iconMap.visitorsClosed,
      label: 'Visits currently not possible',
      default: 'It is not possible to come and visit this space.',
    },
  ],
])

export interface VisitorModalProps {
  show: boolean
  hide: (target?: string) => void
  user: IUser
}

export const VisitorModal = (props: VisitorModalProps) => {
  const { show, hide, user } = props
  const { displayName, openToVisitors } = user

  const displayData =
    openToVisitors && visitorDisplayData.get(openToVisitors.policy)

  if (!displayData) {
    return <></>
  }

  return (
    <Modal
      isOpen={show}
      onDidDismiss={hide}
      width={450}
      sx={{ padding: '0 !important' }}
    >
      <Flex
        sx={{
          borderBottom: '1px solid',
          borderColor: '#999999',
          gap: 2,
          justifyContent: 'space-between',
          padding: 0,
          alignItems: 'anchor-center',
          paddingLeft: '16px',
        }}
      >
        <Flex sx={{ alignItems: 'center', columnGap: '5px' }}>
          {displayData.icon}
          {displayData.label}
        </Flex>
        <ButtonIcon
          data-cy="VisitorModal-CloseButton"
          icon="close"
          onClick={() => hide()}
          sx={{ border: 'none', paddingLeft: 2, paddingRight: 3 }}
        />
      </Flex>
      <Flex sx={{ flexDirection: 'column', padding: '16px' }}>
        {openToVisitors.details && <>Details from {displayName}:</>}
        <Text variant="quiet">
          {openToVisitors.details || displayData.default}
        </Text>
      </Flex>
      {openToVisitors.policy !== 'closed' && (
        <Flex
          sx={{
            padding: '16px',
            borderTop: '1px solid',
            borderColor: '#999999',
          }}
        >
          <Button
            sx={{ margin: 1, width: '100%', justifyContent: 'center' }}
            onClick={() => hide('contact')}
          >
            {/* Not using native button icon to allow centralization together with text */}
            <Flex sx={{ gap: '10px', alignItems: 'center' }}>
              <Icon glyph="contact" />
              Contact the space
            </Flex>
          </Button>
        </Flex>
      )}
    </Modal>
  )
}
