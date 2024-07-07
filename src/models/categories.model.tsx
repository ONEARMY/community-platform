import type { DBDoc } from './dbDoc.model'

export interface ISelectedCategories {
  [key: string]: boolean
}

export interface ICategory extends DBDoc {
  label: string
}
