import type { ProfileTypeName } from 'oa-shared'

export interface IProfileTypeDetails {
  label: ProfileTypeName
  imageSrc?: string
  cleanImageSrc?: string
  cleanImageVerifiedSrc?: string
  textLabel?: string
}
