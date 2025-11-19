import { Flex, Text } from 'theme-ui'

import { Icon } from '../Icon/Icon'

import type { IStatistic } from './type'

interface Props {
  statistics: IStatistic[]
  visible: boolean
  onOpenModal: (stat: IStatistic) => Promise<void>
  loadingStats: Set<string>
}

export const StatisticsList = ({
  statistics,
  visible,
  onOpenModal,
  loadingStats,
}: Props) => {
  return (
    <>
      {statistics.map((stat, idx) => {
        const statKey = `${stat.icon}-${stat.label}`
        const isLoading = loadingStats.has(statKey)

        return (
          <StatisticItem
            key={idx}
            statistic={stat}
            visible={visible}
            onOpenModal={onOpenModal}
            isLoading={isLoading}
            statKey={statKey}
          />
        )
      })}
    </>
  )
}

const StatisticItem = ({
  statistic,
  visible,
  onOpenModal,
  isLoading,
}: {
  statistic: IStatistic
  visible: boolean
  onOpenModal: (stat: IStatistic) => Promise<void>
  isLoading: boolean
  statKey: string
}) => {
  const hasModal = !!statistic.modalComponent

  return (
    <Flex
      sx={{
        alignItems: 'center',
        fontSize: 1,
        display: [visible ? 'flex' : 'none', 'flex'],
        cursor: hasModal ? 'pointer' : 'default',
        opacity: isLoading ? 0.6 : 1,
        pointerEvents: isLoading ? 'none' : 'auto',
        px: 2,
        py: 1,
        mb: 1,
      }}
      onClick={() => hasModal && !isLoading && onOpenModal(statistic)}
      data-testid={`stat-${statistic.icon}`}
    >
      <Icon glyph={statistic.icon} mr={1} size="sm" opacity="0.5" />
      <Text
        sx={{
          textDecoration: hasModal ? 'underline' : 'none',
        }}
      >
        {statistic.label}
      </Text>
      {isLoading && (
        <Text ml={1} sx={{ fontSize: 0 }}>
          …
        </Text>
      )}
    </Flex>
  )
}
