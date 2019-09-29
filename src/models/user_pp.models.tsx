import { IUser } from './user.models'

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

export interface IPlasticType {
  label: PlasticTypeLabel
  number: string
  imageSrc?: string
}

export interface IMAchineBuilderXp {
  label: MachineBuilderXpLabel
}

export interface IUserPP extends IUser {}
