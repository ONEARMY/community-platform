export interface IComment {
  text: string
  isUserVerified?: boolean
  isEditable: boolean
  creatorCountry?: string | null
  creatorName: string
  _id: string
  _edited?: string
  _created?: string
  replies?: IComment[]
}
