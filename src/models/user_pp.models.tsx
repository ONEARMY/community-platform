import { IUser } from './user.models'
import { DBDoc } from './common.models'
import { IUploadedFileMeta } from 'src/stores/storage'
import { IConvertedFileMeta } from 'src/components/ImageInput/ImageInput'

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

export type ModerationStatus =
  | 'draft'
  | 'awaiting-moderation'
  | 'rejected'
  | 'accepted'

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

export interface ILink {
  label: string
  url: string
}
export interface IOpeningHours {
  day: string
  openFrom: string
  openTo: string
}

export interface IUserPP extends IUser {
  profileType?: ProfileTypeLabel
  workspaceType?: WorkspaceType | null
  coverImages?: IUploadedFileMeta[] | IConvertedFileMeta[]
  links?: ILink[]
  mapPinDescription?: string
  openingHours?: IOpeningHours[]
  collectedPlasticTypes?: PlasticTypeLabel[]
  machineBuilderXp?: IMAchineBuilderXp[]
  isExpert?: boolean
  isV4Member?: boolean
}

export type IUserPPDB = IUserPP & DBDoc
