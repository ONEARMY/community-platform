// A reminder that dates should be saved in the ISOString format
// i.e. new Date().toISOString() => 2011-10-05T14:48:00.000Z
// This is more consistent than others and allows better querying
export type ISODateString = string

export interface IConvertedFileMeta {
  photoData: File
  objectUrl: string
  name: string
  type: string
}

export type FetchState = 'idle' | 'fetching' | 'completed'

export interface ILatLng {
  lat: number
  lng: number
}

export interface ILocation {
  name: string
  country: string
  countryCode: string
  administrative: string
  latlng: ILatLng
  postcode: string
  value: string
}

export type Collaborator = {
  countryCode?: string | null
  userName: string
  isVerified: boolean
}

export type ContentType = 'questions' | 'projects' | 'research' | 'news'

export type DiscussionContentTypes =
  | 'questions'
  | 'projects'
  | 'research_update'
  | 'news'

export type SubscribableContentTypes =
  | 'questions'
  | 'projects'
  | 'research'
  | 'research_update'
  | 'news'
