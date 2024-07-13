import { Box, Flex } from 'theme-ui'

import { IconCountWithTooltip } from '../IconCountWithTooltip/IconCountWithTooltip'

import type { IconCountWithTooltipProps } from '../IconCountWithTooltip/IconCountWithTooltip'

export interface IconCountGroupProps {
  iconCounts: IconCountWithTooltipProps[]
}

export const IconCountGroup = (props: IconCountGroupProps) => {
  const { iconCounts } = props
  return (
    <Flex
      data-cy="icon-count-group"
      sx={{
        display: ['none', 'flex', 'flex'],
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: [3, 6, 12],
        paddingX: [3, 6, 12],
      }}
    >
      {iconCounts.map((item, index) => (
        <Box key={index}>
          <IconCountWithTooltip
            count={item.count}
            icon={item.icon}
            text={item.text}
            dataCy={item.dataCy} // Optional prop
          />
        </Box>
      ))}
    </Flex>
  )
}
