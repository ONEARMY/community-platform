import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { SiteFooter } from './SiteFooter'

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Components/SiteFooter',
  component: SiteFooter,
} as ComponentMeta<typeof SiteFooter>

export const Default: ComponentStory<typeof SiteFooter> = () => <SiteFooter />
