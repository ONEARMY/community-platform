import { notificationsPreferencesServiceServer } from 'src/services/notificationsPreferencesService.server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { factoryNotificationsPreferences } from '../factories/notificationsPreferences';
import { createMockSupabaseClient } from '../utils/supabaseClientMock';

describe('notificationsPreferencesServiceServer', () => {
  describe('getPreferences', () => {
    let mockClient: ReturnType<typeof createMockSupabaseClient>;
    let consoleErrorSpy;

    beforeEach(() => {
      mockClient = createMockSupabaseClient();
      consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('returns notification preferences when data exists', async () => {
      const mockPreferences = factoryNotificationsPreferences();
      mockClient.mocks.single.mockResolvedValue({ data: mockPreferences });

      const result = await notificationsPreferencesServiceServer.getPreferences(
        mockClient.client,
        123,
      );

      expect(result).toEqual(mockPreferences);
    });

    it('queries notifications_preferences table with correct parameters', async () => {
      const mockPreferences = factoryNotificationsPreferences({ user_id: 456 });
      mockClient.mocks.single.mockResolvedValue({ data: mockPreferences });

      await notificationsPreferencesServiceServer.getPreferences(mockClient.client, 456);

      expect(mockClient.mocks.from).toHaveBeenCalledWith('notifications_preferences');
      expect(mockClient.mocks.select).toHaveBeenCalledWith();
      expect(mockClient.mocks.eq).toHaveBeenCalledWith('user_id', 456);
      expect(mockClient.mocks.single).toHaveBeenCalledWith();
    });

    it('logs error and throws Response.json when query fails', async () => {
      const dbError = new Error('Database connection failed');
      mockClient.mocks.single.mockRejectedValue(dbError);

      await expect(
        notificationsPreferencesServiceServer.getPreferences(mockClient.client, 123),
      ).rejects.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to get notifications preferences:',
        dbError,
      );
    });

    it('throws error when database query fails', async () => {
      const dbError = new Error('Database error');
      Object.defineProperty(dbError, 'statusText', {
        value: 'Internal Server Error',
      });
      mockClient.mocks.single.mockRejectedValue(dbError);

      try {
        await notificationsPreferencesServiceServer.getPreferences(mockClient.client, 123);
      } catch (error) {
        expect(error).toBe(dbError);
      }
    });

    it('handles different user IDs correctly', async () => {
      const mockPreferences = factoryNotificationsPreferences({ user_id: 789 });
      mockClient.mocks.single.mockResolvedValue({ data: mockPreferences });

      const result = await notificationsPreferencesServiceServer.getPreferences(
        mockClient.client,
        789,
      );

      expect(result).toEqual(mockPreferences);
      expect(mockClient.mocks.eq).toHaveBeenCalledWith('user_id', 789);
    });
  });
});
