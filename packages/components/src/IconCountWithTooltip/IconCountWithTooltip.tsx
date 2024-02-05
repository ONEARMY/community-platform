import { Text } from 'theme-ui'

import { Icon } from '../Icon/Icon'
import { Tooltip } from '../Tooltip/Tooltip'

import type { availableGlyphs } from '../Icon/types'

export interface IconCountWithTooltipProps {
  count: number
  icon: availableGlyphs
  text: string
}

export const IconCountWithTooltip = (props: IconCountWithTooltipProps) => {
  const { count, icon, text } = props
  return (
    <Text
      data-tip={text}
      color="black"
      sx={{
        display: 'flex',
        position: 'relative',
        alignItems: 'center',
        fontSize: [1, 2, 2],
      }}
    >
      {count}
      <Icon glyph={icon} ml={1} />
      <Tooltip />
    </Text>
  )
}
