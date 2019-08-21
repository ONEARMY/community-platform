import { ISelectedTags } from './tags.model'
import { IDbDoc, ISODateString } from './common.models'

export interface IEvent extends IEventFormInput, IDbDoc {
  description: string
  host: string
  date: ISODateString
  type: string
  image: string
  tags: ISelectedTags
  slug: string
}

// will most likely populate as some sort of google reference
interface IEventLocation {
  name: string
  country: string
  countryCode: string
  label?: string
  address?: string
  lat: number
  lng: number
}

export interface IEventFilters {
  project: string
  location: string
  dateFrom: Date
  dateTo: Date
  type: string
}

export interface IEventFormInput {
  _id: string
  title: string
  location: IEventLocation
  // note, tags will remain optional as if populated {} will be stripped by db (firestore)
  tags?: ISelectedTags
  // note, datepicker passes simple yyyy-mm-dd string format for dates
  date: ISODateString
  url: string
}
