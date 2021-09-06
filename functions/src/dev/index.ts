/************ GET and POST requests ************************************************
Redirect requests so that if a custom endpoint function exists we can call them
at /api/[endpoint]
As most functions are called from triggers the api is mostly just used for testing
************************************************************************************/

import * as functions from 'firebase-functions'
import cors from 'cors'
import express from 'express'
import { cleanSeedData } from './seed/clean-seed-data'

console.log('dev api ready')

const app = express()
app.use(cors({ origin: true }));

// Ensure dev moethods only accessed on localhost
app.use(function (req, res, next) {
    const host = req.get('host')
    if (host === 'localhost:4002') next()
    else res.status(403).send(`Dev api methods can only be accessed on localhost:4002. Host: [${host}]`)
})

app.get('/', (req, res) => res.status(200).send('Dev Api Working'))

app.post('/seed-clean', (req, res) => cleanSeedData(req, res))


export = functions.https.onRequest(app as any)


/****************************************************************
 *
 ****************************************************************/