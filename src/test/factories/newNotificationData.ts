import type { NewNotificationData } from 'oa-shared';

export const factoryNewNotificationData = (
  userOverloads: Partial<NewNotificationData> = {},
): NewNotificationData => ({
  actionType: 'newComment',
  contentId: 1,
  contentType: 'comment',
  ownedById: 2,
  parentCommentId: null,
  parentContentId: 1,
  sourceContentType: 'news',
  sourceContentId: 1,
  triggeredById: 1,
  ...userOverloads,
});
