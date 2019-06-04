import { IDbDoc, ILocation } from './common.models'

// once populated in the database map pins will automatically have generated doc meta
// including the username of the user who created it, date created etc
export interface IMapPin extends IDbDoc, INewMapPin {}

// these are the fields that maps pins will be populated with
export interface INewMapPin {
  location: ILocation
  type: PinType
}

export interface ILegacyMapPin {
  ID: string
  created_date: string
  description: string
  filters: string[]
  imgs: string[]
  lat: number
  lng: number
  modified_date: string
  name: string
  status: string
  username: string
  website: string
}

export type PinType = 'workspace' | 'machine_builder' | 'wants_to_get_started'
export type LegacyPinType = 'WORKSHOP' | 'STARTED' | 'MACHINE' | 'Machine '
