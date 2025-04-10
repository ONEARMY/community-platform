export class DBMedia {
  id: string
  path: string
  fullPath: string

  constructor(obj: DBMedia) {
    Object.assign(this, obj)
  }
}

interface IMedia {
  id: string
  publicUrl: string
}

interface IMediaFile {
  id: string
  name: string
  size: number
}

export class Image implements IMedia {
  id: string
  publicUrl: string

  constructor(obj: Image) {
    Object.assign(this, obj)
  }
}

export class MediaFile implements IMediaFile {
  id: string
  name: string
  size: number
  url?: string

  constructor(obj: MediaFile) {
    Object.assign(this, obj)
  }
}
