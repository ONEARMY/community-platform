import React, { useCallback, useState } from 'react'
import { Flex, Text } from 'theme-ui'

import { Button } from '../Button/Button'
import { StatisticsList } from './ContentStatisticsList'

import type { IStatistic } from './type'

export interface IProps {
  statistics: IStatistic[]
  alwaysShow?: boolean
}

export const ContentStatistics = ({ statistics, alwaysShow }: IProps) => {
  const [showStats, setShowStats] = useState(false)
  const [activeModal, setActiveModal] = useState<React.ReactNode | null>(null)
  const [loadingStats, setLoadingStats] = useState<Set<string>>(new Set())

  const handleShowStats = () => setShowStats((v) => !v)

  const handleOpenModal = useCallback(async (stat: IStatistic) => {
    if (!stat.modalComponent) return

    const statKey = `${stat.icon}-${stat.label}`
    setLoadingStats((prev) => new Set(prev).add(statKey))

    let data
    try {
      if (stat.onOpen) data = await stat.onOpen()
    } finally {
      setLoadingStats((prev) => {
        const next = new Set(prev)
        next.delete(statKey)
        return next
      })
    }

    const modal = stat.modalComponent(data)
    setActiveModal(
      React.cloneElement(modal as React.ReactElement, {
        onClose: () => setActiveModal(null),
      }),
    )
  }, [])

  const visible = showStats || alwaysShow === true

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
      {/* Mobile Toggle */}
      <Flex
        sx={{
          display: [alwaysShow ? 'none' : 'flex', 'none'],
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onClick={handleShowStats}
      >
        <Text sx={{ fontSize: '13px' }}>
          {showStats ? '' : 'More Information'}
        </Text>
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

      {/* Statistics List */}
      <StatisticsList
        statistics={statistics}
        visible={visible}
        onOpenModal={handleOpenModal}
        loadingStats={loadingStats}
      />

      {/* Modal */}
      {activeModal && activeModal}
    </Flex>
  );
};
