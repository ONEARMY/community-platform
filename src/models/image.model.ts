export class DBMedia {
  id: string
  path: string
  fullPath: string

  constructor(obj: DBMedia) {
    Object.assign(this, obj)
  }
}

export class Media {
  id: string
  publicUrl: string

  constructor(obj: Media) {
    Object.assign(this, obj)
  }
}
