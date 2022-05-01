import { Button } from './Button'
import type { IBtnProps } from './Button'
import type { ComponentStory, ComponentMeta } from '@storybook/react'

export default {
  title: 'Base Components/Button',
  component: Button,
} as ComponentMeta<typeof Button>

const Base: ComponentStory<typeof Button> = (args: IBtnProps) => (
  <Button {...args}>{args.label ? null : 'Button'}</Button>
)

export const Text = Base.bind({})
export const Disabled = Base.bind({})
Disabled.args = {
  disabled: true,
}

export const VariantPrimary = Base.bind({})
VariantPrimary.args = {
  variant: 'primary',
  label: 'Primary',
}
export const VariantSecondary = Base.bind({})
VariantSecondary.args = {
  variant: 'secondary',
  label: 'Secondary',
}

export const VariantOutline = Base.bind({})
VariantOutline.args = {
  variant: 'outline',
  label: 'Outline',
}

export const Small = Base.bind({})
Small.args = {
  small: true,
}
export const Medium = Base.bind({})
Medium.args = {
  medium: true,
}
export const Large = Base.bind({})
Large.args = {
  large: true,
}

export const Icons = Base.bind({})
Icons.args = {
  icon: 'add',
}
