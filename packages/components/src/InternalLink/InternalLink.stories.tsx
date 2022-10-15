import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { InternalLink } from './InternalLink'

export default {
  title: 'Components/InternalLink',
  component: InternalLink,
} as ComponentMeta<typeof InternalLink>

export const Default: ComponentStory<typeof InternalLink> = () => (
  <InternalLink to={`/abc/`}>Link</InternalLink>
)
