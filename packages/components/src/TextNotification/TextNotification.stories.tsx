import type { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'
import { TextNotification } from './TextNotification'

export default {
  title: 'Components/TextNotification',
  component: TextNotification,
} as ComponentMeta<typeof TextNotification>

export const Success: ComponentStory<typeof TextNotification> = () => (
  <TextNotification variant="success" isVisible={true}>
    A short snappy notification
  </TextNotification>
)

export const SuccessDismissable: ComponentStory<
  typeof TextNotification
> = () => {
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

export const Error: ComponentStory<typeof TextNotification> = () => (
  <TextNotification variant="failure" isVisible={true}>
    A short snappy notification
  </TextNotification>
)
