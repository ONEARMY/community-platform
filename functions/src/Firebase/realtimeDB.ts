import { Database, getDatabase } from 'firebase-admin/database'
import { firebaseApp } from './admin'

class RtdbClient {
  private _rtdb: Database

  // HACK - rtdb would fail in some docker emulators so use getter to only initialise when actually called
  get rtdb() {
    if (!this._rtdb) {
      this._rtdb = getDatabase(firebaseApp)
    }
    return this._rtdb
  }

  get = async (path: string) => {
    const snap = await this.rtdb.ref(path).once('value')
    return { ...snap.val() }
  }
  set = async (path: string, value: Record<string, any>) => {
    return new Promise<void>((resolve, reject) => {
      this.rtdb.ref(path).set(value, (err) => {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
  }
  delete = (path: string) => this.rtdb.ref(path).remove()

  update = (path: string, values: any) => this.rtdb.ref(path).update(values)
}
export default new RtdbClient()
