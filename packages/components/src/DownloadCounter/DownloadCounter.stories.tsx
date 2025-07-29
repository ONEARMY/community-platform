import { DownloadCounter } from './DownloadCounter'

import type { Meta, StoryFn } from '@storybook/react-vite'

export default {
  title: 'Components/DownloadCounter',
  component: DownloadCounter,
} as Meta<typeof DownloadCounter>

export const Default: StoryFn<typeof DownloadCounter> = () => (
  <DownloadCounter total={1888999} />
)

export const One: StoryFn<typeof DownloadCounter> = () => (
  <DownloadCounter total={1} />
)

export const Zero: StoryFn<typeof DownloadCounter> = () => (
  <DownloadCounter total={undefined} />
)
