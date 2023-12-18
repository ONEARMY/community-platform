/**
 * Comments are currently used as documents nested
 * underneath Howtos and Research items
 *
 * - Howto: Available at howto.comments
 * - ResearchItem: Available under researchItem.updates.comments
 */

import type { IUser } from './'

export interface IComment {
  _id: string
  _created: string
  _edited?: string
  _creatorId: string
  _deleted?: boolean
  creatorName: IUser['userName']
  creatorCountry?: string | null
  text: string
  isUserVerified?: boolean
}

export interface UserComment extends IComment {
  isEditable: boolean
}
