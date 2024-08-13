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
      sx={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: [3, 4, 6],
        flexWrap: 'wrap',
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
