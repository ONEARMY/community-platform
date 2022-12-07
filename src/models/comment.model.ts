/**
 * Comments are currently used as documents nested
 * underneath Howtos and Research items
 *
 * - Howto: Available at howto.comments
 * - ResearchItem: Available under researchItem.updates.comments
 */
export interface IComment {
  _id: string
  _created: string
  _edited?: string
  _creatorId: string
  creatorName: string
  creatorCountry?: string | null
  text: string
  isUserVerified?: boolean
}
