export const ProfileType = {
  MEMBER: 'member',
  SPACE: 'space',
  WORKSPACE: 'workspace',
  MACHINE_BUILDER: 'machine-builder',
  COMMUNITY_BUILDER: 'community-builder',
  COLLECTION_POINT: 'collection-point',
} as const

export type ProfileTypeLabel = typeof ProfileType[keyof typeof ProfileType]

export interface IProfileType {
  label: ProfileTypeLabel
  imageSrc?: string
  cleanImageSrc?: string
  cleanImageVerifiedSrc?: string
  textLabel?: string
}
