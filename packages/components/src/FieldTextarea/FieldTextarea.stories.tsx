import type { StoryFn, Meta } from '@storybook/react'
import { FieldTextarea } from './FieldTextarea'

export default {
  title: 'Components/FieldTextarea',
  component: FieldTextarea,
} as Meta<typeof FieldTextarea>

export const Default: StoryFn<typeof FieldTextarea> = () => (
  <FieldTextarea input={{} as any} placeholder="Text area input" meta={{}} />
)

export const WithoutResizeHandle: StoryFn<typeof FieldTextarea> = () => (
  <FieldTextarea
    input={{} as any}
    placeholder="Text area input is not resizable"
    sx={{ resize: 'none' }}
    meta={{ error: 'What an error', touched: true }}
  />
)

export const WithError: StoryFn<typeof FieldTextarea> = () => (
  <FieldTextarea
    input={{} as any}
    placeholder="Text area input"
    meta={{ error: 'What an error', touched: true }}
  />
)
