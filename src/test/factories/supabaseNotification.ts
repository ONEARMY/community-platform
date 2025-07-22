import { Notification } from 'oa-shared'

import { FactoryComment } from './Comment'

export const factorySupabaseNotification = (
  notificationOverloads: Partial<Notification> = {},
): Notification => {
  return new Notification({
    id: 1,
    actionType: 'newComment',
    contentType: 'comment',
    contentId: 100,
    content: FactoryComment(),
    createdAt: new Date('2024-01-01'),
    modifiedAt: new Date('2024-01-02'),
    ownedById: 1,
    isRead: false,
    parentContentId: 200,
    parentCommentId: null,
    sourceContentType: 'projects',
    sourceContentId: 300,
    triggeredBy: factoryTriggeredBy(),
    ...notificationOverloads,
  })
}

export const factoryTriggeredBy = (triggeredByOverloads = {}) => {
  return {
    id: 1,
    username: 'daveTheHakkens',
    photoUrl: 'https://url.com/image.png',
    ...triggeredByOverloads,
  }
}
