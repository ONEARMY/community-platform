import { IUser } from './user.models'
import { DBDoc } from './common.models'

export type PlasticTypeLabel =
  | 'pet'
  | 'hdpe'
  | 'pvc'
  | 'ldpe'
  | 'pp'
  | 'ps'
  | 'other'

export type MachineBuilderXpLabel =
  | 'electronics'
  | 'machining'
  | 'welding'
  | 'assembling'
  | 'mould-making'

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

export interface IPlasticType {
  label: PlasticTypeLabel
  number: string
  imageSrc?: string
}

export interface IProfileType {
  label: ProfileTypeLabel
  imageSrc?: string
  cleanImageSrc?: string
  textLabel?: string
}
export interface IWorkspaceType {
  label: WorkspaceType
  imageSrc?: string
  textLabel?: string
  subText?: string
}

export interface IMAchineBuilderXp {
  label: MachineBuilderXpLabel
}

export interface IOpeningHours {
  day: string
  openFrom: string
  openTo: string
}

/**
 * PP users can have a bunch of custom meta fields depending on profile type
 */
export interface IUserPP extends IUser {
  profileType: ProfileTypeLabel
  workspaceType?: WorkspaceType | null
  mapPinDescription?: string | null
  openingHours?: IOpeningHours[]
  collectedPlasticTypes?: PlasticTypeLabel[] | null
  machineBuilderXp?: IMAchineBuilderXp[] | null
  isExpert?: boolean | null
  isV4Member?: boolean | null
}

export type IUserPPDB = IUserPP & DBDoc
