import { Box, Button } from 'theme-ui'

import { ArticleCallToAction, UsefulStatsButton } from '..'
import { UserEngagementWrapper } from './UserEngagementWrapper'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Layout/UserEngagementWrapper',
  component: UserEngagementWrapper,
} as Meta<typeof UserEngagementWrapper>

export const Default: StoryFn<typeof UserEngagementWrapper> = () => (
  <Box sx={{ maxWidth: '1000px', margin: '0 auto' }}>
    <UserEngagementWrapper>
      <Box sx={{ margin: 3 }}>
        <ArticleCallToAction
          author={{
            userName: 'howto._createdBy',
            countryCode: 'howto.creatorCountry',
            isVerified: true,
          }}
        >
          <Button sx={{ fontSize: 2 }} onClick={() => null}>
            Leave a comment
          </Button>
          <UsefulStatsButton
            votedUsefulCount={28}
            hasUserVotedUseful={false}
            isLoggedIn={false}
            onUsefulClick={() => new Promise(() => {})}
          />
        </ArticleCallToAction>
      </Box>
    </UserEngagementWrapper>
  </Box>
)
