// node module imports
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as express from 'express'
import * as functions from 'firebase-functions'

// custom module imports
import * as DB from './databaseBackup'

// dev only
const buildNumber = 1
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
Redirect requests so that if a custom endpoint function exists on koboApi call it,
otherwise pipe request directly to kobo native API
************************************************************************************/

app.all('*', async (req, res, next) => {
  // log the version number for dev / tracking:
  console.log('api build number', buildNumber)
  // get the endpoint based on the request path
  const endpoint = req.path.split('/')[1]
  // *** NOTE currently all request types handled the same, i.e. GET/POST
  // will likely change behaviour in future when required
  switch (endpoint) {
    case 'db-test':
      const token = await DB.AuthTest()
      res.send(token)
    default:
      res.send('invalid api endpoint')
  }
})

// Expose Express API as a single Cloud Function:
exports.api = functions.https.onRequest(app)

app.listen(3000, 'localhost', listen => {
  console.log('API listening on port 3000')
})

// add export so can be used by test
export default app
