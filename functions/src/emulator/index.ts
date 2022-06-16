import * as functions from 'firebase-functions'
import cors from 'cors'
import express from 'express'
import { PubSub } from '@google-cloud/pubsub'
import { seedDataClean } from './seed/data-clean'
import { seedUsersCreate } from './seed/users-create'

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
    res.status(200).send(result)
  }),
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
app.post('/pubsub/:trigger/:topic', async (req, res) => {
  if (!process.env.PUBSUB_EMULATOR_HOST) {
    functions.logger.error(
      'This function should only run locally in an emulator.',
    )
    res.status(400).end()
  }
  const pubsub = new PubSub()

  const trigger: 'topic' | 'schedule' = req.params.trigger as any
  let topic: string = req.params.topic

  console.log({ trigger, topic })

  if (trigger === 'schedule') {
    // prefix scheduled functions to be picked up by firebase
    // https://github.com/firebase/firebase-tools/pull/2011/files
    topic = `firebase-schedule-${topic}`
  }

  const [topics] = await pubsub.getTopics()
  if (!topics.find((t) => t.name.includes(topic))) {
    await pubsub.createTopic(topic)
  }

  const payload = req.body

  const messageID = await pubsub.topic(topic).publishMessage({ json: payload })
  res.status(201).send({
    success: 'Published to pubsub',
    topic,
    messageID,
    payload,
  })
})

// Increase default timeout to max allowed for longer-running operations
export = functions.runWith({ timeoutSeconds: 540 }).https.onRequest(app as any)
