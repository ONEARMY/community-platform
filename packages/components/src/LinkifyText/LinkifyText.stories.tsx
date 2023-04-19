import type { StoryFn, Meta } from '@storybook/react'
import { LinkifyText } from './LinkifyText'

export default {
  title: 'Components/LinkifyText',
  component: LinkifyText,
} as Meta<typeof LinkifyText>

export const Default: StoryFn<typeof LinkifyText> = () => (
  <LinkifyText>
    There are some link.info hidden in this text. https://example.com if you can
    spot all of them.
  </LinkifyText>
)

export const SupportsMentions: StoryFn<typeof LinkifyText> = () => (
  <LinkifyText>
    In addition to a URLs, it is also possible to @mention somone. Although
    there are edge cases where using @&#8288;a-mention should <b>not</b> be a
    link.
  </LinkifyText>
)
