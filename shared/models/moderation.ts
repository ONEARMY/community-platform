export enum IModerationStatus {
  DRAFT = 'draft',
  AWAITING_MODERATION = 'awaiting-moderation',
  IMPROVEMENTS_NEEDED = 'improvements-needed',
  REJECTED = 'rejected',
  ACCEPTED = 'accepted',
}

export interface IModeration {
  moderation: IModerationStatus
  moderatorFeedback?: string
}
export interface IModerable extends IModeration {
  _createdBy?: string
  _id?: string
}

export type IModerationUpdate = {
  _id: string
} & IModeration
