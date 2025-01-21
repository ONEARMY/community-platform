// New models for Supabase

import { IDBDoc, IDoc } from './document'

import type { ContentTypes } from './common'

export class Category extends IDoc {
  name: string
  type: ContentTypes

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

export class DBCategory extends IDBDoc {
  name: string
  type: ContentTypes

  static fromDB(category: DBCategory) {
    return new DBCategory(category)
  }
}
