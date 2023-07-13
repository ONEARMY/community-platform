import type { StoryFn, Meta } from '@storybook/react'
import { CharacterCount } from './CharacterCount'

export default {
  title: 'Components/CharacterCount',
  component: CharacterCount,
} as Meta<typeof CharacterCount>

const errorValues = [
  {
    currentSize: 10,
    minSize: 50,
    maxSize: 200,
  },
  {
    currentSize: 200,
    minSize: 0,
    maxSize: 100,
  },
]

export const Default: StoryFn<typeof CharacterCount> = () => (
  <CharacterCount currentSize={0} minSize={0} maxSize={100} />
)

export const WithValidState: StoryFn<typeof CharacterCount> = () => (
  <CharacterCount currentSize={50} minSize={0} maxSize={100} />
)

export const WithError: StoryFn<typeof CharacterCount> = () => (
  <>
    {errorValues.map((state, index) => {
      return (
        <CharacterCount
          key={index}
          currentSize={state.currentSize}
          minSize={state.minSize}
          maxSize={state.maxSize}
        />
      )
    })}
  </>
)
