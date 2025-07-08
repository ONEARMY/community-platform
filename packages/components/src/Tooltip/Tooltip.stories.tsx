import { Button } from 'theme-ui'

import { Tooltip } from './Tooltip'

import type { Meta, StoryFn } from '@storybook/react-vite'

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
} as Meta<typeof Tooltip>

export const Hover: StoryFn<typeof Tooltip> = () => (
  <>
    <Button data-tooltip-id="tooltip" data-tooltip-content="This is a tooltip">
      Hover over me
    </Button>
    <Tooltip id="tooltip" />
  </>
)
