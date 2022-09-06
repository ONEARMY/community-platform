import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { LinkifyText } from './LinkifyText'

export default {
  title: 'Components/LinkifyText',
  component: LinkifyText,
} as ComponentMeta<typeof LinkifyText>

export const Default: ComponentStory<typeof LinkifyText> = () => (
  <LinkifyText>
    There are some link.info hidden in this text. https://example.com if you can
    spot all of them.
  </LinkifyText>
)
