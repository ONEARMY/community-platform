import { ISelectedTags } from './tags.model'
import { firestore } from 'firebase/app'
import { IDbDoc, ILocation } from './common.models'

export interface IEvent extends IEventFormInput, IDbDoc {
  description: string
  host: string
  date: firestore.Timestamp | Date
  type: string
  image: string
  tags: ISelectedTags
  slug: string
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
  location: ILocation
  // note, tags will remain optional as if populated {} will be stripped by db (firestore)
  tags: ISelectedTags
  // note, datepicker passes simple yyyy-mm-dd string format for dates
  date: string | firestore.Timestamp | Date
  url: string
}
