/**
 * @remarks
 * The `DBDoc` metadata is automatically populated to every document that
 * goes into the database to allow for easier querying and management
 */
export interface DBDoc {
  _id: string
  _created: ISODateString
  _modified: ISODateString
  _deleted: boolean
  _contentModifiedTimestamp: ISODateString
}

/**
 * @remarks
 * The `DBDoc` metadata is automatically populated to every document that
 * goes into the database to allow for easier querying and management
 */

export interface DBQueryOptions {
  order?: 'asc' | 'desc'
  orderBy?: string
  limit?: number
  where?: DBQueryWhereOptions
}
export interface DBQueryWhereOptions {
  field: string
  operator: DBQueryWhereOperator
  value: DBQueryWhereValue
}

export type DBQueryWhereOperator =
  | '>'
  | '>='
  | '<'
  | '=='
  | '!='
  | 'array-contains'
export type DBQueryWhereValue = string | number | boolean

/**
 * @remarks
 * A reminder that dates should be saved in the ISOString format
 * i.e. new Date().toISOString() => 2011-10-05T14:48:00.000Z
 * This is more consistent than others and allows better querying
 */
export type ISODateString = string
