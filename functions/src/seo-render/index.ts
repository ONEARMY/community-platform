import axios from 'axios'
import * as functions from 'firebase-functions'
import * as fs from 'fs'
import { CONFIG } from '../config/config'
import { requestHandler } from './request-handler'

export const seoRender = functions.https.onRequest(
  requestHandler({
    prerenderApiKey: CONFIG.prerender?.api_key,
    deploymentUrl: CONFIG.deployment.site_url,
    httpClient: axios.get,
    syncFileReader: fs.readFileSync,
    logger: functions.logger,
  }),
)
