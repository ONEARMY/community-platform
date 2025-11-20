import React, { useCallback, useState } from 'react';
import { Flex, Text } from 'theme-ui';

import { Button } from '../Button/Button';
import { StatisticsList } from './ContentStatisticsList';

import type { IStatistic } from './type';

export interface IProps {
  statistics: IStatistic[];
  alwaysShow?: boolean;
}

export const ContentStatistics = ({ statistics, alwaysShow }: IProps) => {
  const [showStats, setShowStats] = useState(false);
  const [activeModal, setActiveModal] = useState<React.ReactNode | null>(null);

  const handleShowStats = () => {
    setShowStats(!showStats);
  };

  const handleOpenModal = useCallback(async (stat: IStatistic) => {
    if (!stat.modalComponent) return;
  
    let data = undefined;
    if (stat.onOpen) {
      try {
        data = await stat.onOpen();
      } catch (error) {
        console.error('Error loading modal data:', error);
      }
    }
  
    const modalElement = stat.modalComponent(data);
    if (React.isValidElement(modalElement)) {
      setActiveModal(
        React.cloneElement(modalElement, {
          onClose: () => setActiveModal(null),
        })
      );
    } else {
      setActiveModal(null);
    }
  }, []);

  const visible = showStats || alwaysShow === true;

  return (
    <Flex
      sx={{
        flexDirection: ['column', 'row'],
        justifyContent: ['flex-start', 'center'],
        alignItems: ['flex-start', 'center'],
        gap: [2, 3],
        py: 1,
        pl: [2, 0],
      }}
    >
      <Flex
        sx={{
          display: [alwaysShow ? 'none' : 'flex', 'none'],
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onClick={handleShowStats}
      >
        <Text sx={{ fontSize: '13px' }}>{showStats ? '' : 'More Information'}</Text>
        <Button
          type="button"
          variant="subtle"
          showIconOnly
          icon={showStats ? 'chevron-up' : 'chevron-down'}
          small
          sx={{
            borderWidth: 0,
            '&:hover': { bg: 'white' },
            '&:active': { bg: 'white' },
          }}
        />
      </Flex>

      <StatisticsList
        statistics={statistics}
        visible={visible}
        onOpenModal={handleOpenModal}
      />

      {activeModal && activeModal}
    </Flex>
  );
};
