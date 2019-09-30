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

export type ProfileType =
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
  profileType?: ProfileType
  workspaceType?: WorkspaceType
  coverImages?: IUploadedFileMeta[] | IConvertedFileMeta[]
  links?: ILink[]
  mapPinDescription?: string
  openingHours?: IOpeningHours[]
  collectedPlasticTypes?: IPlasticType[]
  machineBuilderXp?: IMAchineBuilderXp[]
}

export type IUserPPDB = IUserPP & DBDoc
