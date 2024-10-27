import { useMemo } from 'react'
import { Text } from 'theme-ui'

import { Icon } from '../Icon/Icon'
import { Tooltip } from '../Tooltip/Tooltip'

import type { availableGlyphs } from '../Icon/types'

export interface IconCountWithTooltipProps {
  count: number
  dataCy?: string
  icon: availableGlyphs
  text: string
}

export const IconCountWithTooltip = (props: IconCountWithTooltipProps) => {
  const { count, dataCy, icon, text } = props
  const id = useMemo(() => crypto.randomUUID(), [])

  return (
    <>
      <Text
        data-cy={dataCy}
        data-tooltip-id={id}
        data-tooltip-content={text}
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
      </Text>
      <Tooltip id={id} />
    </>
  )
}
