import { Flex, Text } from 'theme-ui'

import { iconMap } from '../Icon/svgs'
import { Modal } from '../Modal/Modal'
import { VisitorModalFooter } from './VisitorModalFooter'
import { VisitorModalHeader } from './VisitorModalHeader'

import type { IUser, UserVisitorPreferencePolicy } from 'oa-shared'
import type { DisplayData, HideProp } from './props'

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

export type VisitorModalProps = HideProp & {
  show: boolean
  user: IUser
}

export const VisitorModal = ({ show, hide, user }: VisitorModalProps) => {
  const { displayName, openToVisitors, isContactableByPublic } = user

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
      {openToVisitors.policy !== 'closed' && isContactableByPublic && (
        <VisitorModalFooter hide={hide} />
      )}
    </Modal>
  )
}
