import * as functions from 'firebase-functions'
import { DB_ENDPOINTS } from '../models'
import { db } from '../Firebase/firestoreDB'

/**
 * Example function to show how an automated email can be triggered
 * In this case it is being used temporarily to help debug
 * https://github.com/ONEARMY/community-platform/issues/883
 */
export const notifyEmailDemo = functions.firestore
  .document(`${DB_ENDPOINTS.users}/precious-plastic`)
  .onWrite(async (change, context) => {
    return db.collection('mail').add({
      to: 'chris.m.clarke@live.co.uk',
      message: {
        subject: 'PP Profile Edited',
        html: `
          <p>Just thought you should know that an edit has been made to your profile</p>
          <h2>Before</h2>
          <code>${JSON.stringify(change.before.data())}</code>
          <h2>After</h2>
          <code>${JSON.stringify(change.after.data())}</code>
          <p>To see a clear breakdown of differences you could copy-paste each section into http://www.jsondiff.com</p>
        `,
      },
    })
  })
