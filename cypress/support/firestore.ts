import * as firebase from 'firebase'
import Query = firebase.firestore.Query

type PromiseCallback = (val?: any) => void

export class Firestore {
  static MAX_BATCH_SIZE = 500;
  db: firebase.firestore.Firestore;

  constructor(firestore: firebase.firestore.Firestore) {
    this.db = firestore
  }

  deleteDocuments = (collectionName: string, fieldPath: string, opStr: any, value: string) => {
    const query = this.db.collection(collectionName).where(fieldPath, opStr, value).limit(Firestore.MAX_BATCH_SIZE);
    return new Promise((resolve, reject) => {
      this.deleteQueryBatch(query, Firestore.MAX_BATCH_SIZE, resolve, reject);
    });
  };
  deleteQueryBatch = (query: Query, batchSize: number, resolve: PromiseCallback, reject: PromiseCallback) => {
    query.get()
      .then((snapshot) => {
        // When there are no documents left, we are done
        if (snapshot.size === 0) {
          return 0;
        }

        // Delete documents in a batch
        const batch = this.db.batch();
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });

        return batch.commit().then(() => {
          return snapshot.size;
        });
      }).then((numDeleted) => {
      if (numDeleted === 0) {
        resolve();
        return;
      }

      process.nextTick(() => {
        this.deleteQueryBatch(query, batchSize, resolve, reject);
      });
    })
      .catch(reject);
  }
}
