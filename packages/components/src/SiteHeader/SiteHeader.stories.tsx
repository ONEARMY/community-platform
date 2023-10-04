import type { Meta, StoryFn } from '@storybook/react'
import { SiteHeader } from './SiteHeader'

export default {
  title: 'Components/SiteHeader',
  component: SiteHeader,
} as Meta<typeof SiteHeader>

export const Default: StoryFn<typeof SiteHeader> = () => (
  <SiteHeader user={{}} menu={[]} notifications={[]} />
)
