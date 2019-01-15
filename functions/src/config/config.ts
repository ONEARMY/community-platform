import * as admin from 'firebase-admin'
import * as config from './config.json'

const SERVICE_ACCOUNT: admin.ServiceAccount = {
  projectId: config.project_id,
  privateKey: config.private_key,
  clientEmail: config.client_email,
}

export default SERVICE_ACCOUNT
