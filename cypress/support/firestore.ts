import * as firebase from 'firebase'
import Query = firebase.firestore.Query
import doc = Mocha.reporters.doc

type PromiseCallback = (val?: any) => void

export class Firestore {
  static MAX_BATCH_SIZE = 500
  db: firebase.firestore.Firestore

  constructor(firestore: firebase.firestore.Firestore) {
    this.db = firestore
  }

  queryDocuments = (collectionName: string, fieldPath: string, opStr: any, value: string): Promise<any> | Promise<any[]> => {
    return this.db.collection(collectionName).where(fieldPath, opStr, value).get()
      .then(snapshot => {
          const result: any[] = []
          if (snapshot.empty) {
            return result
          }
          snapshot.forEach(doc => result.push(doc.data()))
          if (result.length === 1) {
            return result[0]
          }
          return result
        },
      )
  }

  deleteDocuments = (collectionName: string, fieldPath: string, opStr: any, value: string) => {
    const query = this.db.collection(collectionName).where(fieldPath, opStr, value).limit(Firestore.MAX_BATCH_SIZE)
    return new Promise((resolve, reject) => {
      this.deleteQueryBatch(query, Firestore.MAX_BATCH_SIZE, resolve, reject)
    })
  }
  deleteQueryBatch = (query: Query, batchSize: number, resolve: PromiseCallback, reject: PromiseCallback) => {
    query.get()
      .then((snapshot) => {
        // When there are no documents left, we are done
        if (snapshot.size === 0) {
          return 0
        }

        // Delete documents in a batch
        const batch = this.db.batch()
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref)
        })

        return batch.commit().then(() => {
          return snapshot.size
        })
      }).then((numDeleted) => {
      if (numDeleted === 0) {
        resolve()
        return
      }

      process.nextTick(() => {
        this.deleteQueryBatch(query, batchSize, resolve, reject)
      })
    })
      .catch(reject)
  }

   updateDocument = (collectionName: string, docId: string, docData: any) => {
     return this.db.collection(collectionName).doc(docId).set(docData)
  }
}
