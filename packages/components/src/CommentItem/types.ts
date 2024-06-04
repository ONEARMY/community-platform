export interface IComment {
  text: string
  isUserVerified?: boolean
  isUserSupporter?: boolean
  isEditable: boolean
  creatorCountry?: string | null
  creatorName: string
  creatorImage?: string
  _id: string
  _edited?: string
  _created?: string
  replies?: IComment[]
}
