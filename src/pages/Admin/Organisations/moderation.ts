import type { Moderation } from 'oa-shared';

export const MODERATIONS: Moderation[] = [
  'awaiting-moderation',
  'improvements-needed',
  'rejected',
  'accepted',
];

export const FEEDBACK_REQUIRED: Moderation[] = ['improvements-needed', 'rejected'];
