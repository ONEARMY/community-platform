import type { ContentType } from './common'
import type { IDBDocSB, IDoc } from './document'

export class DBCategory implements IDBDocSB {
  id: number
  created_at: Date
  modified_at: Date | null

  name: string
  type: ContentType

  constructor(obj: any) {
    Object.assign(this, obj)
  }

  static toDB(category: Category) {
    const { createdAt, id, modifiedAt, name, type } = category
    return new DBCategory({
      id,
      created_at: new Date(createdAt),
      modified_at: modifiedAt ? new Date(modifiedAt) : null,
      name,
      type,
    })
  }
}

export class Category implements IDoc {
  id: number
  createdAt: Date
  modifiedAt: Date | null
  name: string
  type: ContentType

  constructor(obj: any) {
    Object.assign(this, obj)
  }

  static fromDB(category: DBCategory) {
    const { created_at, id, modified_at, name, type } = category
    return new Category({
      id,
      createdAt: new Date(created_at),
      modifiedAt: modified_at ? new Date(modified_at) : null,
      name,
      type,
    })
  }
}
