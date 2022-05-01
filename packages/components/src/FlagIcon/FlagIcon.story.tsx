import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { FlagIcon } from './FlagIcon'

export default {
  title: 'Base Components/FlagIcon',
  component: FlagIcon,
} as ComponentMeta<typeof FlagIcon>

const Base: ComponentStory<typeof FlagIcon> = (args: any) => (
  <FlagIcon {...args} />
)

export const Flag = Base.bind({})
Flag.args = {
  code: 'nl',
}

export const InvalidCountryCode = Base.bind({})
InvalidCountryCode.args = {
  code: 'invalid-country-code',
}
