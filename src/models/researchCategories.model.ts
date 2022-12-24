import type { DBDoc } from './common.models'

export type ISelectedResearchCategories = Record<string, boolean>

export interface IResearchCategory extends DBDoc {
  label: string
}
