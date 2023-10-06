import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { TabbedContent } from './TabbedContent'

export default {
  title: 'Components/TabbedContent',
  component: TabbedContent,
} as ComponentMeta<typeof TabbedContent>

export const Default: ComponentStory<typeof TabbedContent> = () => (
  <TabbedContent />
)
