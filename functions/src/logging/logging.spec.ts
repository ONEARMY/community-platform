import { agent as supertest } from 'supertest'
import { handleCloudLoggingRequest } from './logging' // Path to your cloud function file
import express from 'express'
import type { Logging } from '@google-cloud/logging'

const app = express()

const writeSpy = jest.fn()

const handler = handleCloudLoggingRequest({
  logger: {
    log: () => ({
      write: writeSpy,
      error: jest.fn(),
      entry: jest.fn(),
    }),
  } as unknown as Logging,
})

app.post('/', handler)

const request = supertest(app)

describe('logToCloudLogging', () => {
  it('should return a 400 error if the request body is an empty object', async () => {
    const res = await request.post('/').send({})
    expect(res.status).toBe(400)
    expect(res.text).toBe('Request body must not be an empty object')
  })

  it('should return a 400 error if the request body is not an object', async () => {
    const res = await request
      .post('/')
      .set('Accept', 'text/html')
      .send('not an object')
    expect(res.status).toBe(400)
    expect(res.text).toBe('Request body must not be an empty object')
  })

  it('should return a 413 error if the request payload size exceeds limit', async () => {
    const largeData = new Array(1e6).join('a') // Creates a string larger than 1MB
    const res = await request
      .post('/')
      .set('Accept', 'application/json')
      .send({ largeData })
    expect(res.status).toBe(413)
    expect(res.text).toBe('Request payload size exceeds limit')
  })

  // Add more tests here for the different types of responses your function can return
  it('should return a 200 status code if the request body is valid', async () => {
    const res = await request.post('/').set('Accept', 'application/json').send({
      foo: 'bar',
    })
    expect(res.status).toBe(200)
    expect(writeSpy).toHaveBeenCalled()
  })
})
