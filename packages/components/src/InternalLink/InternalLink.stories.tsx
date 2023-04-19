import type { StoryFn, Meta } from '@storybook/react'
import { InternalLink } from './InternalLink'

export default {
  title: 'Components/InternalLink',
  component: InternalLink,
} as Meta<typeof InternalLink>

export const Default: StoryFn<typeof InternalLink> = () => (
  <InternalLink to={`/abc/`}>Link</InternalLink>
)
