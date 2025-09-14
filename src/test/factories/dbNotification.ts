import type { DBNotification } from 'oa-shared'

export const factoryDBNotification = (
  userOverloads: Partial<DBNotification> = {},
): DBNotification => ({
  id: 1,
  action_type: 'newComment',
  content_id: 1,
  content_type: 'comment',
  created_at: new Date('2024-01-01T00:00:00Z'),
  is_read: false,
  modified_at: null,
  owned_by: {} as any,
  owned_by_id: 2,
  parent_comment_id: null,
  parent_content_id: 1,
  source_content_type: 'news',
  source_content_id: 1,
  triggered_by: {} as any,
  triggered_by_id: 1,
  should_email: true,
  ...userOverloads,
})
