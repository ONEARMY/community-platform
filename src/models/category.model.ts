import { Image } from './image.model'

import type { DBImage } from './image.model'

export class Category {
  id: number
  name: string
  image: Image | null

  constructor(obj: Category) {
    Object.assign(this, obj)
  }

  static fromDB(obj: DBCategory) {
    return new Category({
      id: obj.id,
      name: obj.name,
      image: obj.image ? Image.fromDB(obj.image) : null,
    })
  }
}

export class DBCategory {
  readonly id: number
  name: string
  image: DBImage | null

  constructor(obj: Omit<Category, 'id'>) {
    Object.assign(this, obj)
  }

  static toDB(obj: Category) {
    return new DBCategory({
      name: obj.name,
      image: obj.image ? Image.fromDB(obj.image) : null,
    })
  }
}
