import type { availableGlyphs } from '../index'

import { Icon, Tooltip } from '../index'
import { Text } from 'theme-ui'

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
