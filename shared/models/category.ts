// New models for Supabase

import { DBDocSB, Doc } from './document'

import type { ContentTypes } from './common'

export class Category extends Doc {
  name: string
  type: ContentTypes

  static fromDB(category: DBCategory) {
    const { created_at, id, name, type } = category
    return new Category({
      id,
      createdAt: new Date(created_at),
      name,
      type,
    })
  }
}

export class DBCategory extends DBDocSB {
  name: string
  type: ContentTypes
}
