// Base level for all content on supabase
export interface DBDocSB {
  readonly id: number
  readonly created_at: Date
  readonly modified_at: Date | null
}

export interface Doc {
  id: number
  createdAt: Date
  modifiedAt: Date | null
}
