
export type IModerationStatus =
  | 'draft'
  | 'awaiting-moderation'
  | 'rejected'
  | 'accepted'

export type ProfileTypeLabel =
  | 'member'
  | 'workspace'
  | 'community-builder'
  | 'collection-point'
  | 'machine-builder'

export type WorkspaceType =
  | 'shredder'
  | 'sheetpress'
  | 'extrusion'
  | 'injection'
  | 'mix'

export interface ILatLng {
  lat: number
  lng: number
}

export type IMapPinType = ProfileTypeLabel
export type IMapPinSubtype = WorkspaceType

export interface IModerable {
  moderation: IModerationStatus
  _createdBy?: string
  _id?: string
}

export interface IMapPin extends IModerable {
  _id: string
  type: IMapPinType
  location: ILatLng
  subType?: IMapPinSubtype
}

export type IPinGrouping = 'individual' | 'place'

export interface IMapGrouping {
  _count?: number
  grouping: IPinGrouping
  displayName: string
  type: IMapPinType
  subType?: IMapPinSubtype
  icon: string
  hidden?: boolean
}
