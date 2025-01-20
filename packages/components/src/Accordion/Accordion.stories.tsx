import { Text } from 'theme-ui'

import { Accordion } from './Accordion'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/Accordion',
  component: Accordion,
} as Meta<typeof Accordion>

export const Default: StoryFn<typeof Accordion> = () => (
  <Accordion title="Default">
    <Text>Default</Text>
  </Accordion>
)
