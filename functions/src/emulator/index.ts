import * as functions from 'firebase-functions'
import cors from 'cors'
import express from 'express'
import { seedDataClean } from './seed/data-clean'
import { seedUsersCreate } from './seed/users-create'
import { triggerPubsub } from './pubsub'
import { seedContentGenerate } from './seed/content-generate'

console.log('emulator api ready')

const app = express()
app.use(cors({ origin: true }))

/**
 * Expose an api endpoint available just for use with emulators
 * NOTE - if changing endpoints check emulators workspace in case in use (e.g. called via Dockerfile)
 */
app.use(function (req, res, next) {
  if (process.env.FUNCTIONS_EMULATOR === 'true') next()
  else
    res
      .status(403)
      .send(
        `Emulator api methods can only be accessed in emulator environment [${process.env.FUNCTIONS_EMULATOR}]`,
      )
})

app.get('/', (req, res) => res.status(200).send('Emulator Api Working'))

app.get('/seed-users-create', (req, res) =>
  seedUsersCreate().then((users) =>
    res
      .status(200)
      .send(`Created users: ${users.map((u) => u.uid).join(', ')}`),
  ),
)

app.get('/seed-clean', (req, res) =>
  seedDataClean().then((result) => {
    res.status(200).send(JSON.stringify(result, null, 2))
  }),
)

app.get('/seed-content-generate', (req, res) =>
  seedContentGenerate().then(() =>
    res.status(200).send('Content generated successfully'),
  ),
)

/**
 * As there is currently no UI to publish pubsub messages for testing, create
 * a http wrapper that can be used to call via rest
 * https://github.com/firebase/firebase-tools/issues/2034
 * https://blog.minimacode.com/publish-message-to-pubsub-emulator/
 *
 * This allows pubsub topics to be tested when running in emulators as an api endpoint
 * It includes additional prefix (/topic or /schedule) depending on trigger
 * @example
 * `http://localhost:4002/community-platform-emulated/us-central1/emulator/pubsub/schedule/dailyTasks`
 * `http://localhost:4002/community-platform-emulated/us-central1/emulator/pubsub/topic/test-topic`
 */
app.all('/pubsub/:trigger/:name', async (req, res) => {
  if (!process.env.PUBSUB_EMULATOR_HOST) {
    functions.logger.error(
      'This function should only run locally in an emulator.',
    )
    res.status(400).end()
  }
  const trigger = req.params.trigger as 'topic' | 'schedule'
  const name = req.params.name
  const payload = req.body
  const messageId = await triggerPubsub({ trigger, name, payload })
  const result = 'Pubsub Published'
  res.status(201).send({ result, trigger, name, messageId, payload })
})

// Increase default timeout to max allowed for longer-running operations
export = functions.runWith({ timeoutSeconds: 540 }).https.onRequest(app as any)
