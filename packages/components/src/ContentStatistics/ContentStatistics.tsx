import { Text, Flex } from 'theme-ui'
import type { availableGlyphs } from '..'
import { Icon } from '..'

export interface IProps {
  statistics: [
    {
      icon: availableGlyphs
      label: string
    },
  ]
}

const ICON_OPACITY = '0.5'
const FONT_SIZE = '1'

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
          fontSize: FONT_SIZE,
        }}
      >
        <Icon
          glyph={statistic.icon}
          mr={1}
          size={'sm'}
          opacity={ICON_OPACITY}
        />
        <Text>{statistic.label}</Text>
      </Flex>
    ))}
  </Flex>
)
