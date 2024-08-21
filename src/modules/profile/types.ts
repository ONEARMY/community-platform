import type { IProfileTypeName } from 'oa-shared'

export interface IProfileTypeDetails {
  label: IProfileTypeName
  imageSrc?: string
  cleanImageSrc?: string
  cleanImageVerifiedSrc?: string
  textLabel?: string
}
