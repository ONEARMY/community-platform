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

const characterCountValues = [
  {
    currentSize: 5,
    minSize: 0,
    maxSize: 200,
    error: null,
  },
  {
    currentSize: 25,
    minSize: 50,
    maxSize: 200,
    error: 'Character count must be a greater than 50 characters',
  },
  {
    currentSize: 500,
    minSize: 0,
    maxSize: 100,
    error: 'Character count must be a less than 100 characters',
  },
]

export const WithCharacterCounts: StoryFn<typeof FieldTextarea> = () => (
  <>
    {characterCountValues.map((state, index) => {
      return (
        <FieldTextarea
          key={index}
          input={
            { value: 'Hello '.repeat(Math.round(state.currentSize / 6)) } as any
          }
          placeholder="Text area input"
          meta={{ touched: true }}
          minLength={state.minSize}
          maxLength={state.maxSize}
          showCharacterCount
        />
      )
    })}
  </>
)
