import type { Meta } from '@storybook/react'
import { Username } from './Username'

export default {
  title: 'Components/Username',
  component: Username,
} as Meta<typeof Username>

export const Verified = {
  args: {
    user: {
      userName: 'a-username',
      countryCode: 'pt',
    },
    isVerified: true,
  },
}

export const Unverified = {
  args: {
    user: {
      countryCode: 'pt',
      userName: 'a-username',
    },
    isVerified: false,
  },
}

export const WithoutFlag = {
  args: {
    user: {
      userName: 'a-username',
    },
    isVerified: false,
  },
}

export const InvalidCountryCode = {
  args: {
    user: {
      userName: 'a-username',
      countryCode: 'zz',
    },
    isVerified: false,
  },
}

export const InlineStyles = {
  args: {
    user: {
      userName: 'a-username',
    },
    sx: {
      outline: '10px solid red',
    },
    isVerified: false,
  },
}
