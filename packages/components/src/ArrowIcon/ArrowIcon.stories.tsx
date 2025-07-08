import { Arrow } from './ArrowIcon'

import type { Meta, StoryFn } from '@storybook/react-vite'

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Components/Arrow icon',
  component: Arrow,
} as Meta<typeof Arrow>

export const Left: StoryFn<typeof Arrow> = () => <Arrow direction="left" />
export const Right: StoryFn<typeof Arrow> = () => <Arrow direction="right" />
