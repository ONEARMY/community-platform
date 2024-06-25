const admin = require('firebase-admin')

const test = require('firebase-functions-test')()

import { v4 as uuid } from 'uuid'
import { getDiscordMessages } from '../Integrations/firebase-discord'
import { DB_ENDPOINTS } from '../models'
import { mapPinUpdate } from './index'
import { IModerationStatus } from 'oa-shared'

describe('mapPinUpdates', () => {
  afterAll(test.cleanup)

  function stubbedMapPinSnapshot(mapPinId, props) {
    return test.firestore.makeDocumentSnapshot(
      {
        _id: mapPinId,
        ...props,
      },
      DB_ENDPOINTS.mappins,
    )
  }

  describe('updateDocuments', () => {
    it('mapPin rejected', async () => {
      // Arrange
      const mapPinId = uuid()
      const mapPinType = 'workspace'
      const wrapped = test.wrap(mapPinUpdate)

      // Act
      await wrapped(
        await test.makeChange(
          stubbedMapPinSnapshot(mapPinId, {
            _id: mapPinId,
            type: mapPinType,
            moderation: IModerationStatus.AWAITING_MODERATION,
          }),
          stubbedMapPinSnapshot(mapPinId, {
            _id: mapPinId,
            type: mapPinType,
            moderation: IModerationStatus.REJECTED,
          }),
        ),
      )

      // Assert
      const expectedMessageStart = `📍 *New ${mapPinType}* pin from ${mapPinId}.`
      const expectedMessageEnd = `/map/#${mapPinId}>`
      const discordMessages = await getDiscordMessages()
      const containsTestMessage = discordMessages.some((message) => {
        return (
          message.content.startsWith(expectedMessageStart) &&
          message.content.endsWith(expectedMessageEnd)
        )
      })
      expect(containsTestMessage).not.toBe(true)
    })

    it('mapPin approved', async () => {
      // Arrange
      const mapPinId = uuid()
      const mapPinType = 'workspace'
      const wrapped = test.wrap(mapPinUpdate)

      // Act
      await wrapped(
        await test.makeChange(
          stubbedMapPinSnapshot(mapPinId, {
            _id: mapPinId,
            type: mapPinType,
            moderation: IModerationStatus.AWAITING_MODERATION,
          }),
          stubbedMapPinSnapshot(mapPinId, {
            _id: mapPinId,
            type: mapPinType,
            moderation: IModerationStatus.ACCEPTED,
          }),
        ),
      )

      // Assert
      const expectedMessageStart = `📍 *New ${mapPinType}* pin from ${mapPinId}.`
      const expectedMessageEnd = `/map/#${mapPinId}>`
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
