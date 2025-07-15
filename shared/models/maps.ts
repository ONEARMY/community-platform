import type { ILatLng } from './common'
import type { ProfileTypeName, WorkspaceType } from './user'

export interface IMapGrouping {
  _count?: number
  grouping: IPinGrouping
  displayName: string
  type: ProfileTypeName
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

export interface MapFilterOption {
  _id: string
  label: string
  filterType: string
  imageSrc?: string
}
