export interface IModeration {
  moderation: Moderation;
  moderationFeedback?: string;
}

export interface IDBModeration {
  moderation: Moderation | null;
  moderation_feedback: string | null;
}

export type Moderation = 'awaiting-moderation' | 'improvements-needed' | 'rejected' | 'accepted';

export const MODERATIONS: Moderation[] = [
  'awaiting-moderation',
  'improvements-needed',
  'rejected',
  'accepted',
];

export const FEEDBACK_REQUIRED: Moderation[] = ['improvements-needed', 'rejected'];
