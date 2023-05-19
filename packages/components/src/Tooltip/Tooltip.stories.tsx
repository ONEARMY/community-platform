import type { StoryFn, Meta } from '@storybook/react'
import { Tooltip } from './Tooltip'
import { Button } from 'theme-ui'

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
