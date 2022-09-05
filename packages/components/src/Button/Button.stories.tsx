import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { Button } from './Button'

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Components/Button',
  component: Button,
} as ComponentMeta<typeof Button>

export const Basic: ComponentStory<typeof Button> = () => (
  <Button>Button Text</Button>
)

export const Disabled: ComponentStory<typeof Button> = () => (
  <Button disabled>Disabled</Button>
)

export const Primary: ComponentStory<typeof Button> = () => (
  <Button variant={'primary'}>Primary</Button>
)

export const Secondary: ComponentStory<typeof Button> = () => (
  <Button variant={'secondary'}>Secondary</Button>
)

export const Outline: ComponentStory<typeof Button> = () => (
  <Button variant={'outline'}>Outline</Button>
)

export const Small: ComponentStory<typeof Button> = () => (
  <Button small={true}>Small Button</Button>
)
export const Medium: ComponentStory<typeof Button> = () => (
  <Button medium={true}>Medium Button</Button>
)
export const Large: ComponentStory<typeof Button> = () => (
  <Button large={true}>Large Button</Button>
)
