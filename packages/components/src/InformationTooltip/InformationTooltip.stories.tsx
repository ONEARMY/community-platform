import { InformationTooltip } from './InformationTooltip'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/Information',
  component: InformationTooltip,
} as Meta<typeof InformationTooltip>

export const Default: StoryFn<typeof InformationTooltip> = () => (
  <InformationTooltip
    glyph="information"
    tooltip="Just a little wrapper for an icon/tooltip"
    size={30}
  />
)
