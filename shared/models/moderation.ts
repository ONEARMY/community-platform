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
