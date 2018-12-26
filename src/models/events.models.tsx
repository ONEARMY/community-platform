export interface IEvent {
  name: string
  location: IEventLocation
  description: string
  host: string
  date: Date
  type: string
  image: string
  _slug: string
  _created: Date
  _modified: Date
}

// will most likely populate as some sort of google reference
interface IEventLocation {
  city: string
  country: string
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
