import { Username } from './Username'

import type { Meta } from '@storybook/react'

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
    isSupporter: false,
  },
}

export const Unverified = {
  args: {
    user: {
      countryCode: 'pt',
      userName: 'a-username',
    },
    isVerified: false,
    isSupporter: false,
  },
}

export const VerifiedSupporter = {
  args: {
    user: {
      countryCode: 'pt',
      userName: 'a-username',
    },
    isVerified: true,
    isSupporter: true,
  },
}

export const UnverifiedSupporter = {
  args: {
    user: {
      countryCode: 'pt',
      userName: 'a-username',
    },
    isVerified: false,
    isSupporter: true,
  },
}

export const WithoutFlag = {
  args: {
    user: {
      userName: 'a-username',
    },
    isVerified: false,
    isSupporter: false,
  },
}

export const InvalidCountryCode = {
  args: {
    user: {
      userName: 'a-username',
      countryCode: 'zz',
    },
    isVerified: false,
    isSupporter: false,
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
    isSupporter: false,
  },
}
