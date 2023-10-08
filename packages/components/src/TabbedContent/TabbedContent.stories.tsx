import type { Meta, StoryFn } from '@storybook/react'
import { TabbedContent } from './TabbedContent'

export default {
  title: 'Components/TabbedContent',
  component: TabbedContent,
} as Meta<typeof TabbedContent>

export const Default: StoryFn<typeof TabbedContent> = () => <TabbedContent />
