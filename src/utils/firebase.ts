import * as firebase from "firebase";
import { FirebaseConfig } from "../../src/config/config";

// initialise with config settings, additional firestore config to support future changes
firebase.initializeApp(FirebaseConfig);
const firestore = firebase.firestore();
firestore.settings({ timestampsInSnapshots: true });

// export firestore db to be accessed as 'db' and firebase auth as 'auth'
export const db = firestore;
export const auth = firebase.auth();
export const storage = firebase.storage();

/* Firestore use examples
   See full docs at: https://firebase.google.com/docs/firestore/

  // Get all documents in a collection
  private async getCollectionDocs() {
    const ref = await db.collection("usermeta").get();
    const docs: any[] = ref.docs.map(doc => doc.data());
    console.log("docs", docs);
  }
*/
