// A reminder that dates should be saved in the ISOString format
// i.e. new Date().toISOString() => 2011-10-05T14:48:00.000Z
// This is more consistent than others and allows better querying
export type ISODateString = string

export interface IConvertedFileMeta {
  photoData: Blob
  objectUrl: string
  name: string
  type: string
}

export type FetchState = 'idle' | 'fetching' | 'completed'
