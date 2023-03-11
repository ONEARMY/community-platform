import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { Icon, glyphs } from './Icon'

export default {
  title: 'Components/Icon',
  component: Icon,
} as ComponentMeta<typeof Icon>

export const Default: ComponentStory<typeof Icon> = () => (
  <Icon glyph="delete" />
)

export const Available: ComponentStory<typeof Icon> = () => (
  <>
    {Object.keys(glyphs).map((glyph: any, key) => (
      <Icon key={key} glyph={glyph} />
    ))}
  </>
)
