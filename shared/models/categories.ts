import type { DBDoc } from './db'

export interface ISelectedCategories {
  [key: string]: boolean
}

export interface ICategory extends DBDoc {
  label: string
}
