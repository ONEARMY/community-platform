import { getConfigurationOption } from 'src/config/config'
import { SupportedProfileTypesFactory } from './SupportedProfileTypesFactory'

export const ProfileType = {
  MEMBER: 'member',
  SPACE: 'space',
  WORKSPACE: 'workspace',
  MACHINE_BUILDER: 'machine-builder',
  COMMUNITY_BUILDER: 'community-builder',
  COLLECTION_POINT: 'collection-point',
} as const

export const getSupportedProfileTypes = SupportedProfileTypesFactory(
  getConfigurationOption('REACT_APP_PLATFORM_PROFILES', ''),
)

export type ProfileTypeLabel = typeof ProfileType[keyof typeof ProfileType]

export type { IProfileType } from './types'
