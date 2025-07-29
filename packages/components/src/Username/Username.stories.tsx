import { Username } from './Username'

import type { Meta } from '@storybook/react-vite'
import type { Author } from 'oa-shared'

export default {
  title: 'Components/Username',
  component: Username,
} as Meta<typeof Username>

export const Verified = {
  args: {
    user: {
      username: 'a-username',
      country: 'pt',
      isSupporter: false,
      isVerified: true,
    } as Author,
  },
}

export const Unverified = {
  args: {
    user: {
      country: 'pt',
      username: 'a-username',
      isVerified: false,
      isSupporter: false,
    } as Author,
  },
}

export const VerifiedSupporter = {
  args: {
    user: {
      country: 'pt',
      username: 'a-username',
      isVerified: true,
      isSupporter: true,
    } as Author,
  },
}

export const UnverifiedSupporter = {
  args: {
    user: {
      country: 'pt',
      username: 'a-username',
      isVerified: false,
      isSupporter: true,
    } as Author,
  },
}

export const WithoutFlag = {
  args: {
    user: {
      username: 'a-username',
    } as Author,
  },
}

export const InvalidCountryCode = {
  args: {
    user: {
      username: 'a-username',
      country: 'zz',
    } as Author,
  },
}

export const InlineStyles = {
  args: {
    user: {
      username: 'a-username',
    } as Author,
    sx: {
      outline: '10px solid red',
    },
  },
}
