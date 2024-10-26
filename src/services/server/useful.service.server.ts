import firebase from 'firebase-admin'

firebase.initializeApp()

const markUseful = (id: string) => {
  return id
}

export const usefulService = {
  markUseful,
}
