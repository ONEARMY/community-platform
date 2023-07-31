/****************************************************************************** *
        Interfaces
/****************************************************************************** */
export interface IUploadedFileMeta {
  sizes: { thumb: string; small: string; medium: string; large: string }
  downloadUrl: string
  contentType?: string | null
  fullPath: string
  name: string
  type: string
  size: number
  timeCreated: string
  updated: string
}
