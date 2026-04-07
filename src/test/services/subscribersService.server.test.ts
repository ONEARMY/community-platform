import { beforeEach, describe, expect, it, vi } from 'vitest';

import { subscribersServiceServer } from '../../services/subscribersService.server';
import {
  FactoryDBResearchItem,
  FactoryResearchItem,
  FactoryResearchItemUpdate,
} from '../factories/ResearchItem';
import { createMockSupabaseClient } from '../utils/supabaseClientMock';

import type { DBResearchItem, ResearchItem, ResearchUpdate } from 'oa-shared';

describe('subscribersServiceServer', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('addResearchSubscribers', () => {
    it('calls add once when no collaborators are present', async () => {
      const mockAdd = vi.fn();
      const mockHeaders = new Headers();
      const { client } = createMockSupabaseClient();

      const research: ResearchItem = FactoryResearchItem({
        id: 123,
        collaboratorsUsernames: [],
      });
      const profileId = 456;

      await subscribersServiceServer.addResearchSubscribers(
        research,
        profileId,
        client,
        mockHeaders,
        mockAdd,
      );

      expect(mockAdd).toHaveBeenCalledTimes(1);
      expect(mockAdd).toHaveBeenCalledWith('research', 123, 456, client, mockHeaders);
    });

    it('calls add right number of times for unique collaborators', async () => {
      const mockAdd = vi.fn();
      const mockHeaders = new Headers();
      const { client, mocks } = createMockSupabaseClient();
      mocks.single.mockResolvedValueOnce({ data: { id: 55 } });
      mocks.single.mockResolvedValueOnce({ data: { id: 55 } });
      mocks.single.mockResolvedValueOnce({ data: { id: 122 } });

      const research: ResearchItem = FactoryResearchItem({
        id: 123,
        collaboratorsUsernames: ['ben', 'ben', 'jeff'],
      });
      const profileId = 456;

      await subscribersServiceServer.addResearchSubscribers(
        research,
        profileId,
        client,
        mockHeaders,
        mockAdd,
      );

      expect(mockAdd).toHaveBeenCalledTimes(3);
      expect(mockAdd).toHaveBeenCalledWith('research', 123, 456, client, mockHeaders);
    });
  });

  describe('addResearchUpdateSubscribers', () => {
    it('calls add twice when no collaborators are present', async () => {
      const mockAdd = vi.fn();
      const mockHeaders = new Headers();
      const { client } = createMockSupabaseClient();

      const update: ResearchUpdate = FactoryResearchItemUpdate({
        id: 789,
        research: FactoryDBResearchItem({
          created_by: 88,
          collaborators: [],
        }),
      });
      const profileId = 456;

      await subscribersServiceServer.addResearchUpdateSubscribers(
        update,
        profileId,
        client,
        mockHeaders,
        mockAdd,
      );

      expect(mockAdd).toHaveBeenCalledTimes(2);
      expect(mockAdd).toHaveBeenCalledWith('research_updates', 789, 456, client, mockHeaders);
      expect(mockAdd).toHaveBeenCalledWith('research_updates', 789, 88, client, mockHeaders);
    });
  });

  describe('updateResearchSubscribers', () => {
    it('does not call add when no new collaborators are present', async () => {
      const mockAdd = vi.fn();
      const mockHeaders = new Headers();
      const { client } = createMockSupabaseClient();

      const oldResearch: DBResearchItem = FactoryDBResearchItem({
        id: 789,
        collaborators: ['luke', 'leia'],
      });

      const newResearch: ResearchItem = FactoryResearchItem({
        id: 789,
        collaboratorsUsernames: ['luke', 'leia'],
      });

      await subscribersServiceServer.updateResearchSubscribers(
        oldResearch,
        newResearch,
        client,
        mockHeaders,
        mockAdd,
      );

      expect(mockAdd).toHaveBeenCalledTimes(0);
    });

    it('calls add for each new unique collaborator', async () => {
      const mockAdd = vi.fn();
      const mockHeaders = new Headers();
      const { client, mocks } = createMockSupabaseClient();

      mocks.single.mockResolvedValueOnce({ data: { id: 99 } });
      mocks.single.mockResolvedValueOnce({ data: { id: 100 } });

      const oldResearch: DBResearchItem = FactoryDBResearchItem({
        id: 789,
        collaborators: ['luke', 'leia'],
      });

      const newResearch: ResearchItem = FactoryResearchItem({
        id: 789,
        collaboratorsUsernames: ['luke', 'leia', 'han', 'chewie'],
      });

      await subscribersServiceServer.updateResearchSubscribers(
        oldResearch,
        newResearch,
        client,
        mockHeaders,
        mockAdd,
      );

      expect(mockAdd).toHaveBeenCalledTimes(2);
      expect(mockAdd).toHaveBeenCalledWith('research', 789, 99, client, mockHeaders);
      expect(mockAdd).toHaveBeenCalledWith('research', 789, 100, client, mockHeaders);
    });
  });
});
