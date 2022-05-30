import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { Heading } from 'theme-ui'

export default {
  title: 'Base Components/Heading',
  component: Heading,
} as ComponentMeta<typeof Heading>

export const Default: ComponentStory<typeof Heading> = () => (
  <Heading>Default Heading style</Heading>
)

export const Small: ComponentStory<typeof Heading> = () => (
  <Heading variant="small">Default Heading style</Heading>
)
