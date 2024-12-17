export class DBImage {
  url: string
  name: string
  extension: string
  size: number

  constructor(obj: DBImage) {
    Object.assign(this, obj)
  }

  static toDB(obj: Image) {
    return new DBImage({
      url: obj.url,
      name: obj.name,
      extension: obj.extension,
      size: obj.size,
    })
  }
}

export class Image {
  url: string
  name: string
  extension: string
  size: number

  constructor(obj: Image) {
    Object.assign(this, obj)
  }

  static fromDB(obj: DBImage) {
    return new Image({
      url: obj.url,
      name: obj.name,
      extension: obj.extension,
      size: obj.size,
    })
  }
}
