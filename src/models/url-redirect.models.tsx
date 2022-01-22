import { DBDoc } from '../stores/databaseV2/types'

export interface UrlRedirect extends DBDoc {
  path: string
  documentType: 'howtos'
  documentId: string
}
