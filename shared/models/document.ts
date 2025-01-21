export class IDoc {
  id: number
  created_at: Date

  constructor(obj) {
    Object.assign(this, obj)
  }
}

export class IDBDoc {
  readonly id: number
  readonly created_at: Date

  constructor(obj) {
    Object.assign(this, obj)
  }
}
