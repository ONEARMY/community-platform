// New models for Supabase

import type { ContentTypes } from './common'

export class Category {
  id: number
  created_at: Date
  name: string
  type: ContentTypes

  constructor(obj: Category) {
    Object.assign(this, obj)
  }

  static fromDB(category: DBCategory) {
    const { created_at, id, name, type } = category
    return new Category({
      id,
      created_at: new Date(created_at),
      name,
      type,
    })
  }
}

export class DBCategory {
  readonly id: number
  readonly created_at: Date
  name: string
  type: ContentTypes

  constructor(obj: Omit<DBCategory, 'id' | 'created_at'>) {
    Object.assign(this, obj)
  }

  static fromDB(category: DBCategory) {
    return new DBCategory(category)
  }
}
