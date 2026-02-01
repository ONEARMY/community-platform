import type { DBNotification } from 'oa-shared';

export const factoryDBNotification = (
  userOverloads: Partial<DBNotification> = {},
): DBNotification => ({
  id: 1,
  title: 'Amazing news!',
  action_type: 'newComment',
  content_id: 1,
  content_type: 'comments',
  created_at: new Date('2024-01-01T00:00:00Z'),
  is_read: false,
  modified_at: null,
  owned_by: {} as any,
  owned_by_id: 2,
  source_content_type: 'news',
  source_content_id: 1,
  triggered_by: {} as any,
  triggered_by_id: 1,
  tenant_id: 'precious-plastic',
  ...userOverloads,
});
