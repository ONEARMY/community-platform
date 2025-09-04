import { broadcastCoordinationServiceServer } from 'src/services/broadcastCoordinationService.server'
import { discordServiceServer } from 'src/services/discordService.server'
import { notificationsSupabaseServiceServer } from 'src/services/notificationSupabaseService.server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { FactoryDBProfile } from '../factories/profile'
import {
  FactoryDBResearchItem,
  FactoryDBResearchItemUpdate,
  FactoryResearchItemUpdate,
} from '../factories/ResearchItem'

vi.mock('src/services/notificationsService.server')
vi.mock('src/services/notificationSupabaseService.server')
vi.mock('src/services/discordService.server')

describe('broadcastCoordinationServiceServer', () => {
  describe('researchUpdate', () => {
    const mockProfile = FactoryDBProfile()
    const mockClient = {} as any
    const mockRequest = new Request('http://example.com')
    const mockResearch = FactoryDBResearchItem({
      is_draft: false,
    })
    const mockHeaders = new Headers()

    beforeEach(() => {
      vi.clearAllMocks()
    })

    describe('when research update has draft research', () => {
      it('does not send any notifications when researchUpdate.research.is_draft is true', () => {
        const researchUpdate = FactoryResearchItemUpdate({
          isDraft: false,
          research: { ...mockResearch, is_draft: true },
        })

        broadcastCoordinationServiceServer.researchUpdate(
          researchUpdate,
          mockProfile,
          mockClient,
          mockHeaders,
          mockRequest,
        )

        expect(
          notificationsSupabaseServiceServer.createNotificationsResearchUpdate,
        ).not.toHaveBeenCalled()
        expect(discordServiceServer.postWebhookRequest).not.toHaveBeenCalled()
      })
    })

    describe('when research update itself is draft', () => {
      it('does not send any notifications when researchUpdate.isDraft is true', () => {
        const researchUpdate = FactoryResearchItemUpdate({
          isDraft: true,
          research: mockResearch,
        })

        broadcastCoordinationServiceServer.researchUpdate(
          researchUpdate,
          mockProfile,
          mockClient,
          mockHeaders,
          mockRequest,
        )

        expect(
          notificationsSupabaseServiceServer.createNotificationsResearchUpdate,
        ).not.toHaveBeenCalled()
        expect(discordServiceServer.postWebhookRequest).not.toHaveBeenCalled()
      })
    })

    describe('when transitioning from non-draft to non-draft', () => {
      it('does not send any notifications when researchUpdate.isDraft is false and oldResearchUpdate.is_draft is false', () => {
        const researchUpdate = FactoryResearchItemUpdate({
          isDraft: false,
          research: mockResearch,
        })
        const oldResearchUpdate = FactoryDBResearchItemUpdate({
          is_draft: false,
        })

        broadcastCoordinationServiceServer.researchUpdate(
          researchUpdate,
          mockProfile,
          mockClient,
          mockHeaders,
          mockRequest,
          oldResearchUpdate,
        )

        expect(
          notificationsSupabaseServiceServer.createNotificationsResearchUpdate,
        ).not.toHaveBeenCalled()
        expect(discordServiceServer.postWebhookRequest).not.toHaveBeenCalled()
      })
    })

    describe('when transitioning from draft to published', () => {
      it('sends all notifications when researchUpdate.isDraft is false and oldResearchUpdate.is_draft is true', () => {
        const researchUpdate = FactoryResearchItemUpdate({
          isDraft: false,
          research: mockResearch,
        })
        const oldResearchUpdate = FactoryDBResearchItemUpdate({
          is_draft: true,
        })

        broadcastCoordinationServiceServer.researchUpdate(
          researchUpdate,
          mockProfile,
          mockClient,
          mockHeaders,
          mockRequest,
          oldResearchUpdate,
        )

        expect(
          notificationsSupabaseServiceServer.createNotificationsResearchUpdate,
        ).toHaveBeenCalledWith(
          mockResearch,
          researchUpdate,
          mockProfile,
          mockClient,
        )
        expect(discordServiceServer.postWebhookRequest).toHaveBeenCalled()
      })

      it('sends all notifications when researchUpdate.isDraft is false and oldResearchUpdate is not provided', () => {
        const researchUpdate = FactoryResearchItemUpdate({
          isDraft: false,
          research: mockResearch,
        })

        broadcastCoordinationServiceServer.researchUpdate(
          researchUpdate,
          mockProfile,
          mockClient,
          mockHeaders,
          mockRequest,
        )

        expect(
          notificationsSupabaseServiceServer.createNotificationsResearchUpdate,
        ).toHaveBeenCalledWith(
          mockResearch,
          researchUpdate,
          mockProfile,
          mockClient,
        )
        expect(discordServiceServer.postWebhookRequest).toHaveBeenCalled()
      })
    })
  })
})
