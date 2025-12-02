import { faker } from '@faker-js/faker';
import { Box, Button } from 'theme-ui';

import { ArticleCallToActionSupabase, UsefulStatsButton } from '..';
import { UserEngagementWrapper } from './UserEngagementWrapper';

import type { Meta, StoryFn } from '@storybook/react-vite';

export default {
  title: 'Layout/UserEngagementWrapper',
  component: UserEngagementWrapper,
} as Meta<typeof UserEngagementWrapper>;

export const Default: StoryFn<typeof UserEngagementWrapper> = () => (
  <Box sx={{ maxWidth: '1000px', margin: '0 auto' }}>
    <UserEngagementWrapper>
      <Box sx={{ margin: 3 }}>
        <ArticleCallToActionSupabase
          author={{
            username: 'library._createdBy',
            country: 'US',
            displayName: 'display name',
            badges: [
              {
                id: 1,
                name: 'pro',
                displayName: 'PRO',
                imageUrl: faker.image.avatar(),
              },
              {
                id: 2,
                name: 'supporter',
                displayName: 'Supporter',
                actionUrl: faker.internet.url(),
                imageUrl: faker.image.avatar(),
              },
            ],
            id: 1,
            photo: null,
          }}
        >
          <Button sx={{ fontSize: 2 }} onClick={() => null}>
            Leave a comment
          </Button>
          <UsefulStatsButton
            hasUserVotedUseful={false}
            isLoggedIn={false}
            onUsefulClick={() => new Promise(() => {})}
          />
        </ArticleCallToActionSupabase>
      </Box>
    </UserEngagementWrapper>
  </Box>
);
