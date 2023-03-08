import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { EditorContent } from './EditorContent'

export default {
  title: 'Components/EditorContent',
  component: EditorContent,
} as ComponentMeta<typeof EditorContent>

export const Default: ComponentStory<typeof EditorContent> = () => (
  <EditorContent />
)
