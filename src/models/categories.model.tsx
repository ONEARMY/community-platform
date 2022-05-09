import type { DBDoc } from './common.models'

export interface ISelectedCategories {
  [key: string]: boolean
}

export interface ICategory extends DBDoc {
  label: string
}
