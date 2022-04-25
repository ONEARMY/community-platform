import * as functions from 'firebase-functions'
import cors from 'cors'
import express from 'express'
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

export = functions.https.onRequest(app as any)
