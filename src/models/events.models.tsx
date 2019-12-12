import { ISelectedTags } from './tags.model'
import { DBDoc, ISODateString, IModerable } from './common.models'
import { ILocation } from 'src/models/common.models'

export interface IEvent extends IEventFormInput, IModerable {
  _createdBy: string
  slug: string
  date: ISODateString
  // description: string
  // host: string
  // type: string
  // image: string
}
export type IEventDB = IEvent & DBDoc

export interface IEventFilters {
  project: string
  location: string
  dateFrom: Date
  dateTo: Date
  type: string
}

export interface IEventFormInput {
  title: string
  location: ILocation
  // note, tags will remain optional as if populated {} will be stripped by db (firestore)
  tags?: ISelectedTags
  // note, datepicker passes simple yyyy-mm-dd string format for dates
  date: string
  url: string
}
