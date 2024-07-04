import { Alert, Flex, Text } from 'theme-ui'

import { SettingsFormWrapper } from './SettingsFormWrapper'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Forms/SettingsFormWrapper',
  component: SettingsFormWrapper,
} as Meta<typeof SettingsFormWrapper>

export const Default: StoryFn<typeof SettingsFormWrapper> = () => (
  <div style={{ maxWidth: '900px' }}>
    <SettingsFormWrapper
      tabs={[
        {
          title: 'Profile',
          header: (
            <Flex sx={{ gap: 2, flexDirection: 'column' }}>
              <Text as="h3">✏️ Complete your profile</Text>
              <Text>
                In order to post comments or create content, we'd like you to
                share something about yourself.
              </Text>
            </Flex>
          ),
          body: <>Form Body 1</>,
          glyph: 'thunderbolt',
        },
        {
          title: 'Notifications',
          body: <>Form Body 2</>,
          notifications: (
            <Alert variant="success">Nice, all submitted fine.</Alert>
          ),
          glyph: 'account-circle',
        },
        {
          title: 'Bad',
          body: <>Form Body 3</>,
          header: <>Bad thing header</>,
          notifications: <Alert variant="failure">Problem! Sort it out!</Alert>,
          glyph: 'bazar',
        },
      ]}
    />
  </div>
)

export const SingleTab: StoryFn<typeof SettingsFormWrapper> = () => (
  <div style={{ maxWidth: '900px' }}>
    <SettingsFormWrapper
      tabs={[
        {
          title: 'Profile',
          body: <>Anything for the moment</>,
          header: <>header</>,
          glyph: 'thunderbolt',
        },
      ]}
    />
  </div>
)
