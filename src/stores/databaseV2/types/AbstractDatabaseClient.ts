import type { Observable } from 'rxjs'
import type { DBDoc, DBQueryOptions } from '.'

export interface AbstractDatabaseClient {
  getDoc<T>(endpoint: string, docId: string): Promise<(T & DBDoc) | undefined>

  setDoc(endpoint: string, doc: any): Promise<void>

  setBulkDocs(endpoint: string, docs: any): Promise<void>

  getCollection<T>(endpoint: string): Promise<(T & DBDoc)[]>

  queryCollection<T>(
    endpoint: string,
    queryOpts: DBQueryOptions,
  ): Promise<(T & DBDoc)[]>

  streamCollection?<T>(
    endpoint: string,
    queryOpts?: DBQueryOptions,
  ): Observable<(T & DBDoc)[]>

  streamDoc?<T>(endpoint: string): Observable<T & DBDoc>

  deleteDoc(endpoint: string, docId: string): Promise<void>
}
