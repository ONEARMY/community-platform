import type { DBDoc } from './dbDoc.model'

export type ISelectedResearchCategories = Record<string, boolean>

export interface IResearchCategory extends DBDoc {
  label: string
}
