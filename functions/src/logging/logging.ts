import * as functions from 'firebase-functions'
import { Logging } from '@google-cloud/logging'
import { json } from 'body-parser'
const jsonParser = json({
  strict: true,
})

const logger = new Logging()

export const handleCloudLoggingRequest =
  (deps: { logger: Logging }) =>
  async (req: functions.https.Request, res: functions.Response) =>
    // Parse JSON and limits body size (default is 100kb)
    jsonParser(req, res, async (err) => {
      const { logger } = deps
      if (err) {
        console.error('ERROR:', err)
        return res
          .status(err.statusCode)
          .send(
            err.type === 'entity.too.large'
              ? 'Request payload size exceeds limit'
              : 'Request payload contains invalid JSON',
          )
      }

      const log = logger.log('platform-logger')

      const metadata = {}

      // Check if the body of the request is an object.
      // If not, return a 400 error status code.
      if (typeof req.body !== 'object' || req.body === null) {
        return res.status(400).send('Request body must be a JSON object')
      }

      if (!Object.keys(req.body).length) {
        return res.status(400).send('Request body must not be an empty object')
      }

      const data = req.body // Log data received in the request body

      try {
        await log.write(log.entry(metadata, data))
        return res.status(200).send(`Logged`)
      } catch (err) {
        log.error(err)
        console.error('ERROR:', err)
        return res.status(500).send('Failed to write log entry')
      }
    })

export const logToCloudLogging = functions.https.onRequest(
  handleCloudLoggingRequest({
    logger,
  }),
)
