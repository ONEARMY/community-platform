import { DBDocSB, Doc } from './document'

export class Tag extends Doc {
  name: string

  static fromDB(obj: DBTag) {
    return new Tag({
      id: obj.id,
      name: obj.name,
    })
  }
}

export class DBTag extends DBDocSB {
  name: string

  static toDB(obj: Tag) {
    return new DBTag({
      name: obj.name,
    })
  }
}
