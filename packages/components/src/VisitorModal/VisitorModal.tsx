import { Flex, Text } from 'theme-ui'

import { Button } from '../Button/Button'
import { ButtonIcon } from '../ButtonIcon/ButtonIcon'
import { Icon } from '../Icon/Icon'
import { iconMap } from '../Icon/svgs'
import { Modal } from '../Modal/Modal'

import type { IUser, UserVisitorPreferencePolicy } from 'oa-shared'
import type { ReactElement } from 'react'

interface DisplayData {
  icon: ReactElement
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

interface HideProp {
  hide: (target?: string) => void
}

type HeaderProps = HideProp & { data: DisplayData }

const VisitorModalHeader = ({ hide, data }: HeaderProps) => (
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
      {data.icon}
      {data.label}
    </Flex>
    <ButtonIcon
      data-cy="VisitorModal-CloseButton"
      icon="close"
      onClick={() => hide()}
      sx={{ border: 'none', paddingLeft: 2, paddingRight: 3 }}
    />
  </Flex>
)

const ContactSpaceButton = ({ hide }: HideProp) => (
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
)

export type VisitorModalProps = HideProp & {
  show: boolean
  user: IUser
}

export const VisitorModal = ({ show, hide, user }: VisitorModalProps) => {
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
      <VisitorModalHeader data={displayData} hide={hide} />
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
          <ContactSpaceButton hide={hide} />
        </Flex>
      )}
    </Modal>
  )
}
