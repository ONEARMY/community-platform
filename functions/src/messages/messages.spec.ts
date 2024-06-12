import { handleSendMessage } from './messages' // Path to your cloud function file
import { SendMessage } from 'oa-shared'
import * as functions from 'firebase-functions'

const defaultData: SendMessage = {
  to: 'to@email.com',
  message: 'test message',
  name: 'test user',
}

describe('sendMessage', () => {
  it("should return a 401 if auth isn't provided", async () => {
    expect(handleSendMessage(defaultData, {} as any)).rejects.toThrow(
      new functions.https.HttpsError('unauthenticated', 'Unauthenticated'),
    )
  })

  it('should return a 403 if the user is blocked', async () => {
    const context = { auth: { uid: 'abc' } }

    jest.mock('./messages', () => ({
      isBlocked: () => jest.fn().mockResolvedValue(true),
      reachedLimit: () => jest.fn().mockResolvedValue(false),
    }))

    expect(handleSendMessage(defaultData, context as any)).rejects.toThrow(
      new functions.https.HttpsError('permission-denied', 'User is Blocked'),
    )
  })

  it('should return a 429 if the user message limit exceeded', async () => {
    const context = { auth: { uid: 'abc' } }

    jest.mock('./messages', () => ({
      isBlocked: () => jest.fn().mockResolvedValue(false),
      reachedLimit: () => jest.fn().mockResolvedValue(true),
    }))

    expect(handleSendMessage(defaultData, context as any)).rejects.toThrow(
      new functions.https.HttpsError('resource-exhausted', 'Limit exceeded'),
    )
  })
})
