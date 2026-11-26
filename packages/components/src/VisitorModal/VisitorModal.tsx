import type { Profile, UserVisitorPreferencePolicy } from 'oa-shared';
import { Flex, Text } from 'theme-ui';
import { iconMap } from '../Icon/svgs';
import { Modal } from '../Modal/Modal';
import type { DisplayData, HideProp } from './props';
import { VisitorModalFooter } from './VisitorModalFooter';
import { VisitorModalHeader } from './VisitorModalHeader';

export const visitorDisplayData = new Map<UserVisitorPreferencePolicy, DisplayData>([
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
]);

export type VisitorModalProps = HideProp & {
  show: boolean;
  user: Profile;
  canContact?: boolean;
};

export const VisitorModal = ({ show, hide, user, canContact }: VisitorModalProps) => {
  const { displayName, visitorPolicy } = user;

  const displayData = visitorPolicy && visitorDisplayData.get(visitorPolicy.policy);

  if (!displayData) {
    return null;
  }

  return (
    <Modal isOpen={show} onDismiss={hide} width={450} sx={{ padding: '0 !important' }}>
      <VisitorModalHeader data={displayData} hide={hide} />
      <Flex data-cy="VisitorModal" sx={{ flexDirection: 'column', padding: '16px' }}>
        {visitorPolicy.details && <>Details from {displayName}:</>}
        <Text variant="quiet">{visitorPolicy.details || displayData.default}</Text>
      </Flex>
      {visitorPolicy.policy !== 'closed' && canContact && <VisitorModalFooter hide={hide} />}
    </Modal>
  );
};
