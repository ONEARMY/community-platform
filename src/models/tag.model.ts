export class Tag {
  id: number
  name: string

  constructor(obj: Tag) {
    Object.assign(this, obj)
  }

  static fromDB(obj: DBTag) {
    return new Tag({
      id: obj.id,
      name: obj.name,
    })
  }
}

export class DBTag {
  readonly id: number
  name: string

  constructor(obj: Omit<Tag, 'id'>) {
    Object.assign(this, obj)
  }

  static toDB(obj: Tag) {
    return new DBTag({
      name: obj.name,
    })
  }
}
