import { getAuth } from 'firebase-admin/auth'
import { firebaseApp } from './admin'

export const firebaseAuth = getAuth(firebaseApp)
