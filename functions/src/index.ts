// node module imports
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as express from 'express'
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
admin.initializeApp()

// custom module imports
import * as DB from './databaseBackup'
import * as ImageConverter from './imageConverter'
import * as StorageFunctions from './storageFunctions'
import * as UtilsFunctions from './utils'
import * as AnalyticsFunctions from './analytics'

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
      const token = await UtilsFunctions.AuthTest()
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

exports.weeklyTasks = functions.pubsub
  .topic('weekly-tick')
  .onPublish(async (message, context) => {
    const backup = await DB.BackupDatabase()
  })

exports.dailyTasks = functions.pubsub
  .topic('daily-tick')
  .onPublish(async (message, context) => {
    // we don't have daily tasks currently
  })

/************ Storage Triggers ******************************************************
Functions called in response to changes to firebase storage objects
************************************************************************************/

exports.imageResize = functions.storage
  .object()
  .onFinalize(async (object, context) => {
    if (
      object.metadata &&
      (object.metadata.resized || object.metadata.original)
    )
      return Promise.resolve()
    return ImageConverter.resizeImage(object)
  })

/************ Callable *************************************************************
These can be called from directly within the app (passing additional auth info)
https://firebase.google.com/docs/functions/callable
Any functions added here should have a custom url rewrite specified in root firebase.json
to handle CORS preflight requests correctly
************************************************************************************/
exports.removeStorageFolder = functions.https.onCall((data, context) => {
  console.log('storage folder remove called', data, context)
  const path = data.text
  StorageFunctions.deleteStorageItems(data.text)
})
exports.getAnalytics = functions.https.onCall(
  (data: getAnalyticsData, context) => {
    AnalyticsFunctions.getAnalyticsReport(data.viewId)
  },
)
exports.getAccessToken = functions.https.onCall(
  async (data: getAccessTokenData, context) => {
    const token = await UtilsFunctions.getAccessToken(data.accessScopes)
    console.log('token received', token)
    return token
  },
)

// add export so can be used by test
export default app

interface getAnalyticsData {
  viewId: string
}
interface getAccessTokenData {
  accessScopes: string[]
}
