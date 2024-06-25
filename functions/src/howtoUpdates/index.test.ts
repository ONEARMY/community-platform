const admin = require('firebase-admin')

const test = require('firebase-functions-test')()

import { v4 as uuid } from 'uuid'
import { getDiscordMessages } from '../Integrations/firebase-discord'
import { DB_ENDPOINTS } from '../models'
import { howtoUpdate } from './index'
import { IModerationStatus } from 'oa-shared'

describe('howtoUpdates', () => {
  afterAll(test.cleanup)

  function stubbedHowtoSnapshot(howtoId, props) {
    return test.firestore.makeDocumentSnapshot(
      {
        _id: howtoId,
        ...props,
      },
      DB_ENDPOINTS.howtos,
    )
  }

  describe('updateDocuments', () => {
    it('howto rejected', async () => {
      // Arrange
      const userId = uuid()
      const howtoId = uuid()
      const howtoTitle = 'Testing Howto'
      const wrapped = test.wrap(howtoUpdate)

      // Act
      await wrapped(
        await test.makeChange(
          stubbedHowtoSnapshot(howtoId, {
            _createdBy: userId,
            title: howtoTitle,
            slug: howtoId,
            moderation: IModerationStatus.AWAITING_MODERATION,
          }),
          stubbedHowtoSnapshot(howtoId, {
            _createdBy: userId,
            title: howtoTitle,
            slug: howtoId,
            moderation: IModerationStatus.REJECTED,
          }),
        ),
      )

      // Assert
      const expectedMessageStart = `📓 Yeah! New How To **${howtoTitle}** by *${userId}*`
      const expectedMessageEnd = `/how-to/${howtoId}>`
      const discordMessages = await getDiscordMessages()
      const containsTestMessage = discordMessages.some((message) => {
        return (
          message.content.startsWith(expectedMessageStart) &&
          message.content.endsWith(expectedMessageEnd)
        )
      })
      expect(containsTestMessage).not.toBe(true)
    })

    it('howto approved', async () => {
      // Arrange
      const userId = uuid()
      const howtoId = uuid()
      const howtoTitle = 'Testing Howto'
      const wrapped = test.wrap(howtoUpdate)

      // Act
      await wrapped(
        await test.makeChange(
          stubbedHowtoSnapshot(howtoId, {
            _createdBy: userId,
            title: howtoTitle,
            slug: howtoId,
            moderation: IModerationStatus.AWAITING_MODERATION,
          }),
          stubbedHowtoSnapshot(howtoId, {
            _createdBy: userId,
            title: howtoTitle,
            slug: howtoId,
            moderation: IModerationStatus.ACCEPTED,
          }),
        ),
      )

      // Assert
      const expectedMessageStart = `📓 Yeah! New How To **${howtoTitle}** by *${userId}*`
      const expectedMessageEnd = `/how-to/${howtoId}>`
      const discordMessages = await getDiscordMessages()
      const containsTestMessage = discordMessages.some((message) => {
        return (
          message.content.startsWith(expectedMessageStart) &&
          message.content.endsWith(expectedMessageEnd)
        )
      })
      expect(containsTestMessage).toBe(true)
    })
  })
})
