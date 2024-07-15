import { useState } from 'react'

import { TextNotification } from './TextNotification'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Layout/TextNotification',
  component: TextNotification,
} as Meta<typeof TextNotification>

export const Success: StoryFn<typeof TextNotification> = () => (
  <TextNotification variant="success" isVisible={true}>
    A short snappy notification
  </TextNotification>
)

export const SuccessDismissable: StoryFn<typeof TextNotification> = () => {
  const [visible, setVisibility] = useState(true)
  return (
    <TextNotification
      variant="success"
      isVisible={visible}
      onDismiss={setVisibility}
    >
      A short snappy notification
    </TextNotification>
  )
}

export const Error: StoryFn<typeof TextNotification> = () => (
  <TextNotification variant="failure" isVisible={true}>
    A short snappy notification
  </TextNotification>
)
