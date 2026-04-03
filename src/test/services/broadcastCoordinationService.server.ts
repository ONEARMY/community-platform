import { BroadcastCoordinationServiceServer } from 'src/services/broadcastCoordinationService.server';
import { discordServiceServer } from 'src/services/discordService.server';
import { NotificationsSupabaseServiceServer } from 'src/services/notificationsSupabaseService.server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FactoryDBProfile } from '../factories/profile';
import {
  FactoryDBResearchItem,
  FactoryDBResearchItemUpdate,
  FactoryResearchItemUpdate,
} from '../factories/ResearchItem';

vi.mock('src/services/notificationsService.server');
vi.mock('src/services/notificationSupabaseService.server');
vi.mock('src/services/discordService.server');

describe('broadcastCoordinationServiceServer', () => {
  describe('researchUpdate', () => {
    const mockProfile = FactoryDBProfile();
    const mockClient = {} as any;
    const mockRequest = new Request('http://example.com');
    const mockResearch = FactoryDBResearchItem({
      is_draft: false,
    });

    beforeEach(() => {
      vi.clearAllMocks();
      vi.spyOn(
        NotificationsSupabaseServiceServer.prototype,
        'createNotificationsResearchUpdate',
      ).mockImplementation(vi.fn());
    });

    describe('when research update has draft research', () => {
      it('does not send any notifications when researchUpdate.research.is_draft is true', () => {
        const researchUpdate = FactoryResearchItemUpdate({
          isDraft: false,
          research: { ...mockResearch, is_draft: true },
        });

        const broadcastCoordinationServiceServer = new BroadcastCoordinationServiceServer(
          mockClient,
        );

        broadcastCoordinationServiceServer.researchUpdate(researchUpdate, mockProfile, mockRequest);

        expect(
          NotificationsSupabaseServiceServer.prototype.createNotificationsResearchUpdate,
        ).not.toHaveBeenCalled();
        expect(discordServiceServer.postWebhookRequest).not.toHaveBeenCalled();
      });
    });

    describe('when research update itself is draft', () => {
      it('does not send any notifications when researchUpdate.isDraft is true', () => {
        const researchUpdate = FactoryResearchItemUpdate({
          isDraft: true,
          research: mockResearch,
        });

        new BroadcastCoordinationServiceServer(mockClient).researchUpdate(
          researchUpdate,
          mockProfile,
          mockRequest,
        );

        expect(
          NotificationsSupabaseServiceServer.prototype.createNotificationsResearchUpdate,
        ).not.toHaveBeenCalled();
        expect(discordServiceServer.postWebhookRequest).not.toHaveBeenCalled();
      });
    });

    describe('when transitioning from non-draft to non-draft', () => {
      it('does not send any notifications when researchUpdate.isDraft is false and oldResearchUpdate.is_draft is false', () => {
        const researchUpdate = FactoryResearchItemUpdate({
          isDraft: false,
          research: mockResearch,
        });
        const oldResearchUpdate = FactoryDBResearchItemUpdate({
          is_draft: false,
        });

        new BroadcastCoordinationServiceServer(mockClient).researchUpdate(
          researchUpdate,
          mockProfile,
          mockRequest,
          oldResearchUpdate,
        );

        expect(
          NotificationsSupabaseServiceServer.prototype.createNotificationsResearchUpdate,
        ).not.toHaveBeenCalled();
        expect(discordServiceServer.postWebhookRequest).not.toHaveBeenCalled();
      });
    });

    describe('when transitioning from draft to published', () => {
      it('sends all notifications when researchUpdate.isDraft is false and oldResearchUpdate.is_draft is true', () => {
        const researchUpdate = FactoryResearchItemUpdate({
          isDraft: false,
          research: mockResearch,
        });
        const oldResearchUpdate = FactoryDBResearchItemUpdate({
          is_draft: true,
        });

        new BroadcastCoordinationServiceServer(mockClient).researchUpdate(
          researchUpdate,
          mockProfile,
          mockRequest,
          oldResearchUpdate,
        );

        expect(
          NotificationsSupabaseServiceServer.prototype.createNotificationsResearchUpdate,
        ).toHaveBeenCalledWith(mockResearch, researchUpdate, mockProfile);
        expect(discordServiceServer.postWebhookRequest).toHaveBeenCalled();
      });

      it('sends all notifications when researchUpdate.isDraft is false and oldResearchUpdate is not provided', () => {
        const researchUpdate = FactoryResearchItemUpdate({
          isDraft: false,
          research: mockResearch,
        });

        new BroadcastCoordinationServiceServer(mockClient).researchUpdate(
          researchUpdate,
          mockProfile,
          mockRequest,
        );

        expect(
          NotificationsSupabaseServiceServer.prototype.createNotificationsResearchUpdate,
        ).toHaveBeenCalledWith(mockResearch, researchUpdate, mockProfile);
        expect(discordServiceServer.postWebhookRequest).toHaveBeenCalled();
      });
    });
  });
});
