import type { DBDoc } from './common.models'

export interface ISelectedResearchCategories {
  [key: string]: boolean
}

export interface IResearchCategory extends DBDoc {
  label: string
}
