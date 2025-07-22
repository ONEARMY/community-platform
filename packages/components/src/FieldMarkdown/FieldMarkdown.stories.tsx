import { FieldMarkdown } from './FieldMarkdown'

import type { Meta, StoryFn } from '@storybook/react-vite'

export default {
  title: 'Forms/FieldMarkdown',
  component: FieldMarkdown,
} as Meta<typeof FieldMarkdown>

const imageUpload = () => Promise.resolve('')

export const Default: StoryFn<typeof FieldMarkdown> = () => (
  <FieldMarkdown
    imageUploadHandler={imageUpload}
    input={{} as any}
    placeholder="Text area input"
    meta={{}}
  />
)

export const WithError: StoryFn<typeof FieldMarkdown> = () => (
  <FieldMarkdown
    imageUploadHandler={imageUpload}
    input={{} as any}
    placeholder="Text area input"
    meta={{ error: 'What an error', touched: true }}
  />
)
