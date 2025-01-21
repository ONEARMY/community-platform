export abstract class Doc {
  id: number
  createdAt: Date

  constructor(obj: any) {
    Object.assign(this, obj)
  }
}

export abstract class DBDocSB {
  readonly id: number
  readonly created_at: Date

  constructor(obj: any) {
    Object.assign(this, obj)
  }
}
