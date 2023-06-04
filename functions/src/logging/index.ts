import * as functions from 'firebase-functions'
import { Logging } from '@google-cloud/logging'
const logging = new Logging()

export const logToCloudLogging = functions.https.onRequest(async (req, res) => {
  const log = logging.log('platform-logger')

  const metadata = {}

  // Check if the body of the request is an object.
  // If not, return a 400 error status code.
  if (typeof req.body !== 'object' || req.body === null) {
    res.status(400).send('Request body must be a JSON object')
    return
  }

  // Perform some validation on the request body
  const data = req.body // Log data received in the request body

  try {
    await log.write(log.entry(metadata, data))
    res.status(200).send(`Logged`)
  } catch (err) {
    log.error(err)
    console.error('ERROR:', err)
    res.status(500).send('Failed to write log entry')
  }
})
