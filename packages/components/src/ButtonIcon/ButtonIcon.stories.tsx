import { ButtonIcon } from './ButtonIcon'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Map/ButtonIcon',
  component: ButtonIcon,
} as Meta<typeof ButtonIcon>

export const WithClose: StoryFn<typeof ButtonIcon> = () => (
  <ButtonIcon icon="close" />
)
