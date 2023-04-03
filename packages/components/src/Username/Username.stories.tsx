import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { Username } from './Username'

export default {
  title: 'Components/Username',
  component: Username,
} as ComponentMeta<typeof Username>

const Template: ComponentStory<typeof Username> = (args) => (
  <Username {...args} />
)

export const Verified = Template.bind({})
Verified.args = {
  user: {
    userName: 'a-username',
    countryCode: 'pt',
  },
  isVerified: true,
}

export const Unverified = Template.bind({})
Unverified.args = {
  user: {
    countryCode: 'pt',
    userName: 'a-username',
  },
  isVerified: false,
}

export const WithoutFlag = Template.bind({})
WithoutFlag.args = {
  user: {
    userName: 'a-username',
  },
  isVerified: false,
}

export const InvalidCountryCode = Template.bind({})
InvalidCountryCode.args = {
  user: {
    userName: 'a-username',
    countryCode: 'zz',
  },
  isVerified: false,
}

export const InlineStyles = Template.bind({})
InlineStyles.args = {
  user: {
    userName: 'a-username',
  },
  sx: {
    outline: '10px solid red',
  },
  isVerified: false,
}
