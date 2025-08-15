import type { ILatLng } from './common'
import type { ProfileBadge } from './profileBadge'
import type { ProfileTag } from './profileTag'
import type { ProfileType } from './profileType'
import type { WorkspaceType } from './user'

export interface IMapGrouping {
  _count?: number
  grouping: IPinGrouping
  displayName: string
  type: string
  subType?: WorkspaceType
  icon: string
  hidden?: boolean
}

export interface IBoundingBox {
  _northEast: ILatLng
  _southWest: ILatLng
}

export enum IPinGrouping {
  INDIVIDUAL = 'individual',
  PLACE = 'place',
}

export type MapFilters = {
  tags?: ProfileTag[]
  badges?: ProfileBadge[]
  types?: ProfileType[]
  settings?: string[]
}

export type DBMapSettings = {
  default_type_filters: string[] | null
  setting_filters: string[] | null
}

export type DefaultMapFilters = {
  types?: string[]
}

export type FilterResponse = {
  filters: MapFilters
  defaultFilters: DefaultMapFilters
}
