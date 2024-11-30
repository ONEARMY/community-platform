import admin from 'firebase-admin'

// Initialize Firebase Admin with your service account key
if (admin.apps.length === 0 && process.env.FIREBASE_PROJECT_ID) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/gm, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  })
}

export const verifyFirebaseToken = async (idToken: string) => {
  try {
    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken)

    return { valid: true, user_id: decodedToken.user_id }
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error)
    return { valid: false, error: error.message }
  }
}
