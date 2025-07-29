// USED FOR MAP ONLY - remove after map migration
export enum IModerationStatus {
  DRAFT = 'draft',
  AWAITING_MODERATION = 'awaiting-moderation',
  IMPROVEMENTS_NEEDED = 'improvements-needed',
  REJECTED = 'rejected',
  ACCEPTED = 'accepted',
}

export interface IModerable {
  moderation: IModerationStatus
}

export interface IModeration {
  moderation: Moderation
  moderatonFeedback?: string
}

export interface IDBModeration {
  moderation: Moderation
  moderation_feedback: string | null
}

export type Moderation =
  | 'awaiting-moderation'
  | 'improvements-needed'
  | 'rejected'
  | 'accepted'
