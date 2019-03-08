// node module imports
import * as bodyParser from 'body-parser'
import * as corsLib from 'cors'
const cors = corsLib({ origin: true })
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
import * as postCommentsCounter from './postCommentsCounter'
import { Credentials } from 'google-auth-library'

// update on change logging purposes
const buildNumber = 1.09

// express settings to handle api
const app = express()
// use bodyparse to create json object from body
app.use(
  bodyParser.json({
    limit: '1mb',
  }),
)
// configure app to use cors by default
app.use(corsLib({ origin: true }))
app.use(bodyParser.urlencoded({ extended: false }))

/************ GET and POST requests ************************************************
Redirect requests so that if a custom endpoint function exists we can call them
at /api/[endpoint]
************************************************************************************/

app.all('*', async (req, res, next) => {
  // add cors to requests
  cors(req, res, async () => {
    // get the endpoint based on the request path
    const endpoint = req.path.split('/')[1]
    // *** NOTE currently all request types handled the same, i.e. GET/POST
    // will likely change behaviour in future when required
    switch (endpoint) {
      case 'db-test':
        const testToken = await UtilsFunctions.AuthTest()
        res.send(testToken)
        break
      case 'backup':
        const response = await DB.BackupDatabase()
        res.send(response)
        break
      case 'getAccessToken':
        const token = await UtilsFunctions.getAccessToken(
          req.params.accessScopes,
        )
        res.send(token)
        break
      default:
        res.send('invalid api endpoint')
    }
  })
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
// use service agent to gain access credentials for gcp with  given access scopes
exports.getAccessToken = functions.https.onCall(
  async (data: getAccessTokenData, context) => {
    const token = await UtilsFunctions.getAccessToken(data.accessScopes)
    return token
  },
)
interface getAccessTokenData {
  accessScopes: string[]
}

exports.getAnalytics = functions.https.onCall(
  async (data: getAnalyticsData, context) => {
    console.log('get analytics request received', data)
    AnalyticsFunctions.getAnalyticsReport(data.viewId, data.token)
  },
)
interface getAnalyticsData {
  viewId: string
  token: string
}

exports.updateCommentsCount = postCommentsCounter.updateCommentsCount

// add export so can be used by test
export default app
