import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SubscribersServiceServer } from '../../services/subscribersService.server';
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
      const { client } = createMockSupabaseClient();

      const research: ResearchItem = FactoryResearchItem({
        id: 123,
        collaboratorsUsernames: [],
      });
      const profileId = 456;

      const service = new SubscribersServiceServer(client);
      const mockAdd = vi.spyOn(service, 'add').mockImplementation(vi.fn());

      await service.addResearchSubscribers(
        research,
        profileId,
      );

      expect(mockAdd).toHaveBeenCalledTimes(1);
      expect(mockAdd).toHaveBeenCalledWith('research', 123, 456);
    });

    it('calls add right number of times for unique collaborators', async () => {
      const { client, mocks } = createMockSupabaseClient();
      mocks.single.mockResolvedValueOnce({ data: { id: 55 } });
      mocks.single.mockResolvedValueOnce({ data: { id: 55 } });
      mocks.single.mockResolvedValueOnce({ data: { id: 122 } });

      const research: ResearchItem = FactoryResearchItem({
        id: 123,
        collaboratorsUsernames: ['ben', 'ben', 'jeff'],
      });
      const profileId = 456;

      const service = new SubscribersServiceServer(client);
      const mockAdd = vi.spyOn(service, 'add').mockImplementation(vi.fn());

      await service.addResearchSubscribers(
        research,
        profileId,
      );

      expect(mockAdd).toHaveBeenCalledTimes(3);
      expect(mockAdd).toHaveBeenCalledWith('research', 123, 456);
    });
  });

  describe('addResearchUpdateSubscribers', () => {
    it('calls add twice when no collaborators are present', async () => {
      const { client } = createMockSupabaseClient();

      const update: ResearchUpdate = FactoryResearchItemUpdate({
        id: 789,
        research: FactoryDBResearchItem({
          created_by: 88,
          collaborators: [],
        }),
      });
      const profileId = 456;

      const service = new SubscribersServiceServer(client);
      const mockAdd = vi.spyOn(service, 'add').mockImplementation(vi.fn());

      await service.addResearchUpdateSubscribers(
        update,
        profileId,
      );

      expect(mockAdd).toHaveBeenCalledTimes(2);
      expect(mockAdd).toHaveBeenCalledWith('research_updates', 789, 456);
      expect(mockAdd).toHaveBeenCalledWith('research_updates', 789, 88);
    });
  });

  describe('updateResearchSubscribers', () => {
    it('does not call add when no new collaborators are present', async () => {
      const { client } = createMockSupabaseClient();

      const oldResearch: DBResearchItem = FactoryDBResearchItem({
        id: 789,
        collaborators: ['luke', 'leia'],
      });

      const newResearch: ResearchItem = FactoryResearchItem({
        id: 789,
        collaboratorsUsernames: ['luke', 'leia'],
      });

      const service = new SubscribersServiceServer(client);
      const mockAdd = vi.spyOn(service, 'add').mockImplementation(vi.fn());

      await service.updateResearchSubscribers(
        oldResearch,
        newResearch,
      );

      expect(mockAdd).toHaveBeenCalledTimes(0);
    });

    it('calls add for each new unique collaborator', async () => {
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

      const service = new SubscribersServiceServer(client);
      const mockAdd = vi.spyOn(service, 'add').mockImplementation(vi.fn());

      await service.updateResearchSubscribers(
        oldResearch,
        newResearch,
      );

      expect(mockAdd).toHaveBeenCalledTimes(2);
      expect(mockAdd).toHaveBeenCalledWith('research', 789, 99);
      expect(mockAdd).toHaveBeenCalledWith('research', 789, 100);
    });
  });
});
