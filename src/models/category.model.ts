export class Category {
  id: number
  name: string

  constructor(obj: Category) {
    Object.assign(this, obj)
  }

  static fromDB(obj: DBCategory) {
    return new Category({
      id: obj.id,
      name: obj.name,
    })
  }
}

export class DBCategory {
  readonly id: number
  name: string

  constructor(obj: Omit<Category, 'id'>) {
    Object.assign(this, obj)
  }
}
