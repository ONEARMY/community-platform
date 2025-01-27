// Old models for firebase - being dropped asap

import type { DBDoc } from './db'

export interface ISelectedCategories {
  [key: string]: boolean
}

export interface ICategory extends DBDoc {
  label: string
}
