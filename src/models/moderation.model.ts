import type { IModerationStatus } from 'oa-shared'

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
