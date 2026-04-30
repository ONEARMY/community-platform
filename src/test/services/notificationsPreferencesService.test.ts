import { NotificationsPreferencesFormData } from 'oa-shared';
import { notificationsPreferencesService } from 'src/services/notificationsPreferencesService';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
const mockEmailReachField = { value: '1', label: 'All emails' };

describe('notificationsPreferencesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPreferences', () => {
    it('returns preferences when fetch succeeds', async () => {
      const mockPreferences = { id: 1, comments: true, replies: false };
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ preferences: mockPreferences }),
      });

      const result = await notificationsPreferencesService.getPreferences();

      expect(mockFetch).toHaveBeenCalledWith('/api/notifications-preferences');
      expect(result).toEqual(mockPreferences);
    });

    it('returns null when fetch fails', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await notificationsPreferencesService.getPreferences();

      expect(result).toBeNull();
      expect(mockConsoleError).toHaveBeenCalledWith(expect.any(Error));
    });

    it('returns null when json parsing fails', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      const result = await notificationsPreferencesService.getPreferences();

      expect(result).toBeNull();
      expect(mockConsoleError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('setPreferences', () => {
    it('sends correct FormData', async () => {
      const mockResponse = { ok: true };
      mockFetch.mockResolvedValue(mockResponse);

      const formData = {
        comments: true,
        replies: false,
        researchUpdates: true,
        emailContentReach: mockEmailReachField,
        isUnsubscribed: false,
      } satisfies NotificationsPreferencesFormData;

      const result = await notificationsPreferencesService.setPreferences(formData);

      expect(mockFetch).toHaveBeenCalledWith('/api/notifications-preferences', {
        method: 'POST',
        body: expect.any(FormData),
      });

      const [, options] = mockFetch.mock.calls[0];
      const body = options.body as FormData;

      expect(body.get('comments')).toBe('true');
      expect(body.get('replies')).toBe('false');
      expect(body.get('researchUpdates')).toBe('true');
      expect(body.get('isUnsubscribed')).toBe('false');
      expect(result).toBe(mockResponse);
    });
  });
});
