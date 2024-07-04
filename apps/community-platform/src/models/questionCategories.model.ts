import type { DBDoc } from './common.models'

export type ISelectedQuestionCategories = Record<string, boolean>

export interface IQuestionCategory extends DBDoc {
  label: string
}
