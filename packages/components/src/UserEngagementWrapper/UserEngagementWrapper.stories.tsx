import { Box, Button, Flex } from 'theme-ui';

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
        <Flex sx={{ gap: 2, justifyContent: 'center' }}>
          <Button sx={{ fontSize: 2 }} onClick={() => null}>
            Leave a comment
          </Button>
          <Button>Mark as useful</Button>
        </Flex>
      </Box>
    </UserEngagementWrapper>
  </Box>
);
