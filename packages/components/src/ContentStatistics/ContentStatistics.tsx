import { Text, Flex } from 'theme-ui'
import type { availableGlyphs } from '..'
import { Icon } from '..'

export interface IProps {
  statistics: {
    icon: availableGlyphs
    label: string
  }[]
}

export const ContentStatistics = (props: IProps) => (
  <Flex
    data-cy={'ContentStatistics'}
    py={1}
    sx={{ alignItems: 'center', justifyContent: 'center', gap: 2 }}
  >
    {props.statistics.map((statistic, idx) => (
      <Flex
        key={idx}
        px={2}
        py={1}
        mb={1}
        sx={{
          alignItems: 'center',
          fontSize: '1',
        }}
      >
        <Icon glyph={statistic.icon} mr={1} size={'sm'} opacity={'0.5'} />
        <Text>{statistic.label}</Text>
      </Flex>
    ))}
  </Flex>
)
