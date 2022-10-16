import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { Username } from './Username'

export default {
  title: 'Components/Username',
  component: Username,
} as ComponentMeta<typeof Username>

export const Verified: ComponentStory<typeof Username> = () => (
  <Username
    user={{
      userName: 'a-username',
      countryCode: 'pt',
    }}
    isVerified={true}
  />
)

export const Unverified: ComponentStory<typeof Username> = () => (
  <Username
    user={{
      countryCode: 'pt',
      userName: 'a-username',
    }}
    isVerified={false}
  />
)

export const WithoutFlag: ComponentStory<typeof Username> = () => (
  <Username
    user={{
      userName: 'a-username',
    }}
    isVerified={false}
  />
)

export const InlineStyles: ComponentStory<typeof Username> = () => (
  <Username
    user={{
      userName: 'a-username',
    }}
    sx={{
      outline: '10px solid red',
    }}
    isVerified={false}
  />
)
