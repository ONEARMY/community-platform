// A reminder that dates should be saved in the ISOString format
// i.e. new Date().toISOString() => 2011-10-05T14:48:00.000Z
// This is more consistent than others and allows better querying
export type ISODateString = string

export type UserMention = {
  username: string
  location: string
}

export type Collaborator = {
  countryCode?: string | null
  userName: string
  isVerified: boolean
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
interface ILatLng {
  lat: number
  lng: number
}

export type FetchState = 'idle' | 'fetching' | 'completed'
