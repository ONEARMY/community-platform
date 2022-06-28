import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { MoreContainer } from './MoreContainer'
import { Heading, Flex } from 'theme-ui'

export default {
  title: 'Base Components/MoreContainer',
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
} as ComponentMeta<typeof MoreContainer>

export const Default: ComponentStory<typeof MoreContainer> = () => (
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
