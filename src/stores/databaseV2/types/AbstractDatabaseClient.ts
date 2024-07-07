import type { Observable } from 'rxjs'
import type { DBDoc, DBQueryOptions } from './dbDoc'

export interface AbstractDatabaseClient {
  getDoc<T>(endpoint: string, docId: string): Promise<(T & DBDoc) | undefined>

  setDoc(endpoint: string, doc: any): Promise<void>

  updateDoc(endpoint: string, doc: any): Promise<void>

  setBulkDocs(endpoint: string, docs: any): Promise<void>

  getCollection<T>(endpoint: string): Promise<(T & DBDoc)[]>

  queryCollection<T>(
    endpoint: string,
    queryOpts: DBQueryOptions,
  ): Promise<(T & DBDoc)[]>

  deleteDoc(endpoint: string, docId: string): Promise<void>
}

// Some clients support document streaming (e.g. firebase does, indexedDB does not)
export interface AbstractDatabaseClientStreamable
  extends AbstractDatabaseClient {
  streamCollection<T>(
    endpoint: string,
    queryOpts?: DBQueryOptions,
  ): Observable<(T & DBDoc)[]>

  streamDoc<T>(endpoint: string): Observable<T & DBDoc>
}
