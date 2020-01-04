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
  coverImages?: IUploadedFileMeta[] | IConvertedFileMeta[] | null
  links?: ILink[]
  mapPinDescription?: string | null
  openingHours?: IOpeningHours[]
  collectedPlasticTypes?: PlasticTypeLabel[] | null
  machineBuilderXp?: IMAchineBuilderXp[] | null
  isExpert?: boolean | null
  isV4Member?: boolean | null
}

export type IUserPPDB = IUserPP & DBDoc
