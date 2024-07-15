import { Flex, Heading } from 'theme-ui'

import { MoreContainer } from './MoreContainer'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Layout/MoreContainer',
  component: MoreContainer,
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'twitter',
      values: [
        { name: 'twitter', value: '#00aced' },
        { name: 'facebook', value: '#3b5998' },
      ],
    },
  },
} as Meta<typeof MoreContainer>

export const Default: StoryFn<typeof MoreContainer> = () => (
  <MoreContainer m={'0 auto'} pt={60} pb={90}>
    <Flex
      sx={{
        alignItems: 'center',
        flexDirection: 'column',
      }}
      mt={5}
    >
      <Heading>Some heading</Heading>
      <>Some content</>
    </Flex>
  </MoreContainer>
)
