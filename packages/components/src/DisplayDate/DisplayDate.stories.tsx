import { subMonths } from 'date-fns'

import { DisplayDate } from './DisplayDate'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Components/DisplayDate',
  component: DisplayDate,
} as Meta<typeof DisplayDate>

export const Default: StoryFn<typeof DisplayDate> = () => {
  return <DisplayDate date={new Date()}></DisplayDate>
}

export const TwoMonthsAGo: StoryFn<typeof DisplayDate> = () => {
  const twoMonthsAGo = subMonths(new Date(), 2)
  return <DisplayDate date={twoMonthsAGo}></DisplayDate>
}
