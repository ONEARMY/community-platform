// node module imports
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as express from 'express'
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
admin.initializeApp()

// custom module imports
import * as DB from './databaseBackup'

// update on change logging purposes
const buildNumber = 1.03

// express settings to handle api
const app = express()
// Automatically allow cross-origin requests
app.use(cors({ origin: true }))
// use bodyparse to create json object from body
app.use(
  bodyParser.json({
    limit: '1mb',
  }),
)
app.use(bodyParser.urlencoded({ extended: false }))

/************ GET and POST requests ************************************************
Redirect requests so that if a custom endpoint function exists we can call them
at /api/[endpoint]
************************************************************************************/

app.all('*', async (req, res, next) => {
  // get the endpoint based on the request path
  const endpoint = req.path.split('/')[1]
  // *** NOTE currently all request types handled the same, i.e. GET/POST
  // will likely change behaviour in future when required
  switch (endpoint) {
    case 'db-test':
      const token = await DB.AuthTest()
      res.send(token)
      break
    case 'backup':
      const response = await DB.BackupDatabase()
      res.send(response)
      break
    default:
      res.send('invalid api endpoint')
  }
})
exports.api = functions.https.onRequest(app)

app.listen(3000, 'localhost', listen => {
  console.log(`API v${buildNumber} listening on port 3000`)
})

/************ Cron tasks ***********************************************************
Use pubsub to automatically subscribe to messages sent from cron.
Add/change schedule from `./functions-cron/appengine/cron.yaml`
************************************************************************************/

exports.backupFirestore = functions.pubsub
  .topic('firebase-backup')
  .onPublish(async (message, context) => {
    console.log('initiating backup')
    // run our daily db backup task
    const backup = await DB.BackupDatabase()
    console.log('backup:', backup)
    return true
  })

// add export so can be used by test
export default app
