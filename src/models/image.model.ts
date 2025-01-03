export class DBImage {
  id: string
  path: string
  fullPath: string

  constructor(obj: DBImage) {
    Object.assign(this, obj)
  }
}

export class Image {
  id: string
  publicUrl: string

  constructor(obj: Image) {
    Object.assign(this, obj)
  }
}
