import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { Icon, glyphs } from './Icon'

export default {
  title: 'Components/Icon',
  component: Icon,
} as ComponentMeta<typeof Icon>

export const Default: ComponentStory<typeof Icon> = () => (
  <Icon glyph="delete" />
)

export const Sizes: ComponentStory<typeof Icon> = () => (
  <>
    {['xl', 'lg', 'md', 'sm', 'xs'].map((size, key) => (
      <Icon glyph="delete" key={key} size={size} />
    ))}
  </>
)

export const Available: ComponentStory<typeof Icon> = () => (
  <>
    {Object.keys(glyphs).map((glyph: any, key) => (
      <Icon key={key} glyph={glyph} />
    ))}
  </>
)

export const Colours: ComponentStory<typeof Icon> = () => (
  <>
    {['#37ecba', '#47d5b9', '#57c1c5', '#72afd3'].map((color, key) => (
      <Icon glyph="delete" key={key} color={color} size={'lg'} />
    ))}
  </>
)
