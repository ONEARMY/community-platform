// Import Firebase Functions and Admin SDK
import * as functions from 'firebase-functions'
import axios from 'axios'
import { migrationEnabled, migrationProject } from '../Utils/migration.utils'
import { CONFIG } from '../config/config'

const MIGRATION_API = 'https://supabase-migration-api.fly.dev/migration'
const MIGRATION_API_KEY = CONFIG.migration.api_key

async function sendToSupabase(userDoc) {
  try {
    const response = await axios.post(`${MIGRATION_API}/auth`, userDoc, {
      headers: {
        'x-api-key': MIGRATION_API_KEY,
      },
    })

    console.log('User synced with Supabase')
    // console.log('User synced with Supabase:', response.data)
    // return response.data
  } catch (error) {
    console.error(
      'Error syncing user with Supabase:',
      error.response?.data || error.message,
    )
    throw new Error('Failed to sync user with Supabase')
  }
}

// Firebase function triggered on user creation
exports.default = functions.auth.user().onCreate((user) => {
  if (!migrationEnabled) return
  const userDoc = {
    uid: user.uid,
    project: migrationProject,
    email: user.email,
    doc: user,
  }
  console.log('Sending new user to supabase')
  // console.log('Sending new user to supabase:', JSON.stringify(userDoc))
  return sendToSupabase(userDoc)
})
