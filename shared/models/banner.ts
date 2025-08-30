import type { IDBDocSB, IDoc } from './document'

export class DBBanner implements IDBDocSB {
  id: number
  created_at: Date
  modified_at: Date | null

  text: string
  url: string

  constructor(obj: any) {
    Object.assign(this, obj)
  }
}

export class Banner implements IDoc {
  id: number
  createdAt: Date
  modifiedAt: Date | null
  text: string
  url: string

  constructor(obj: any) {
    Object.assign(this, obj)
  }

  static fromDB(banner: DBBanner) {
    const { created_at, id, modified_at, text, url } = banner
    return new Banner({
      id,
      createdAt: new Date(created_at),
      modifiedAt: modified_at ? new Date(modified_at) : null,
      text,
      url,
    })
  }
}
