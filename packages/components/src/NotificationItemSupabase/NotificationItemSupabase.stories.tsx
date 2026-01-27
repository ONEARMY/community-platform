import { Flex, Heading } from 'theme-ui';

import { fakeDisplayNotification } from '../utils';
import { NotificationItemSupabase } from './NotificationItemSupabase';

import type { Meta, StoryFn } from '@storybook/react-vite';

export default {
  title: 'Components/NotificationItemSupabase',
  component: NotificationItemSupabase,
} as Meta<typeof NotificationItemSupabase>;

const newsCommentNotification = fakeDisplayNotification();
const newsReplyNotification = fakeDisplayNotification({
  contentType: 'comments',
});

// const questionCommentNotification = fakeDisplayNotification()
// const questionReplyNotification = fakeDisplayNotification()
// const researchCommentNotification = fakeDisplayNotification()
// const researchReplyNotification = fakeDisplayNotification()

const markRead = () => console.log('markRead');
const modalDismiss = () => console.log('modalDismiss');

export const Default: StoryFn<typeof NotificationItemSupabase> = () => (
  <Flex sx={{ gap: 2, maxWidth: '700px', flexDirection: 'column' }}>
    <Heading>News</Heading>
    <NotificationItemSupabase
      markRead={markRead}
      modalDismiss={modalDismiss}
      notification={newsCommentNotification}
    />
    <NotificationItemSupabase
      markRead={markRead}
      modalDismiss={modalDismiss}
      notification={newsReplyNotification}
    />
    {/* <Heading>Questions</Heading>
    <NotificationItemSupabase
      markRead={markRead}
      modalDismiss={modalDismiss}
      notification={questionCommentNotification}
    />
    <NotificationItemSupabase
      markRead={markRead}
      modalDismiss={modalDismiss}
      notification={questionReplyNotification}
    />
    <Heading>Research</Heading>
    <NotificationItemSupabase
      markRead={markRead}
      modalDismiss={modalDismiss}
      notification={researchCommentNotification}
    />
    <NotificationItemSupabase
      markRead={markRead}
      modalDismiss={modalDismiss}
      notification={researchReplyNotification}
    /> */}
  </Flex>
);
