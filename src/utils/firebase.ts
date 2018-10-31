import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import { FirebaseDevConfig } from "../../src/config/config.dev";
import { FirebaseProdConfig } from "../../src/config/config.prod";

const FirebaseConfig =
  process.env.NODE_ENV === "production"
    ? FirebaseProdConfig
    : FirebaseProdConfig;
console.log("env?", process.env.NODE_ENV);
console.log("config", FirebaseConfig);
// initialise with config settings, additional firestore config to support future changes
firebase.initializeApp(FirebaseConfig);
firebase.firestore().settings({ timestampsInSnapshots: true });

// export firebase endpoints to be accessed by other functions
export const db = firebase.firestore();
export const storage = firebase.storage();
export const auth = firebase.auth();

// want to also expose the default firebase user
/* tslint:disable: no-empty-interface*/
export interface IFirebaseUser extends firebase.User {}

/* Firestore use examples
   See full docs at: https://firebase.google.com/docs/firestore/

  // Get all documents in a collection
  private async getCollectionDocs() {
    const ref = await db.collection("usermeta").get();
    const docs: any[] = ref.docs.map(doc => doc.data());
    console.log("docs", docs);
  }
*/
