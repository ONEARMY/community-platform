import type { DBDoc } from './dbDoc.model'

export type ISelectedQuestionCategories = Record<string, boolean>

export interface IQuestionCategory extends DBDoc {
  label: string
}
