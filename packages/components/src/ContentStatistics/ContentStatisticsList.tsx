import { Flex, Text } from 'theme-ui';

import { Icon } from '../Icon/Icon';
import { Tooltip } from '../Tooltip/Tooltip';

import type { IStatistic } from './types';

interface Props {
  statistics: IStatistic[];
  visible: boolean;
  onOpenModal: (stat: IStatistic) => Promise<void>;
}

export const StatisticsList = ({ statistics, visible, onOpenModal }: Props) => {
  return (
    <>
      {statistics.map((stat, idx) => {
        return (
          <StatisticItem key={idx} statistic={stat} visible={visible} onOpenModal={onOpenModal} />
        );
      })}
    </>
  );
};

const StatisticItem = ({
  statistic,
  visible,
  onOpenModal,
}: {
  statistic: IStatistic;
  visible: boolean;
  onOpenModal: (stat: IStatistic) => Promise<void>;
}) => {
  const displayModal = !!statistic.modalComponent && statistic.stat;
  // capitalize first letter of label
  const label = statistic.label.slice(0, 1).toUpperCase() + statistic.label.slice(1).toLowerCase();

  return (
    <>
      <Flex
        sx={{
          alignItems: 'center',
          fontSize: '1',
          paddingX: 2,
          display: [visible ? 'flex' : 'none', 'flex', 'flex'],
          cursor: displayModal ? 'pointer' : 'default',
        }}
        onClick={() => displayModal && onOpenModal(statistic)}
        data-testid={`ContentStatistics-${statistic.icon}`}
        data-cy={`ContentStatistics-${statistic.label}`}
        data-tooltip-id={statistic.label}
        data-tooltip-content={label}
      >
        <Icon glyph={statistic.icon} mr={1} size="sm" opacity="0.5" />
        <Text
          sx={{
            textDecoration: displayModal ? 'underline' : 'none',
          }}
        >
          {statistic.stat}
        </Text>
      </Flex>
      <Tooltip id={statistic.label} />
    </>
  );
};
