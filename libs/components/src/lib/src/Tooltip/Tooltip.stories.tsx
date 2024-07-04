import { Button } from 'theme-ui'

import { Tooltip } from './Tooltip'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
} as Meta<typeof Tooltip>

export const Hover: StoryFn<typeof Tooltip> = () => (
  <>
    <Button data-tip="This is a tooltip">Hover over me</Button>
    <Tooltip />
  </>
)
