import type { StoryFn, Meta } from '@storybook/react'
import { Accordion } from './Accordion'
import { Text } from 'theme-ui'

export default {
  title: 'Components/Accordion',
  component: Accordion,
} as Meta<typeof Accordion>

export const Default: StoryFn<typeof Accordion> = () => (
  <Accordion title="Default">
    <Text>Default</Text>
  </Accordion>
)
