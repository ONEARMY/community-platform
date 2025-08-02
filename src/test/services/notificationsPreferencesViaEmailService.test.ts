import { notificationsPreferencesViaEmailService } from 'src/services/notificationsPreferencesViaEmailService'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const createFetchResponse = (data: any, ok = true, status = 200) => ({
  ok,
  status,
  json: async () => data,
})

describe('notificationsPreferencesViaEmailService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
  })

  describe('getPreferences', () => {
    it('should return preferences when API call succeeds', async () => {
      const mockPreferences = {
        is_contactable: true,
        preferences: {
          id: 1,
          user_id: 123,
          comments: true,
          replies: false,
          research_updates: true,
          is_unsubscribed: false,
        },
      }

      global.fetch = vi
        .fn()
        .mockResolvedValue(createFetchResponse(mockPreferences))

      const result =
        await notificationsPreferencesViaEmailService.getPreferences('user123')

      expect(fetch).toHaveBeenCalledWith(
        '/api/notifications-preferences-via-email/user123',
      )
      expect(result).toEqual(mockPreferences)
    })

    it('should return null when API returns HTTP error', async () => {
      global.fetch = vi
        .fn()
        .mockResolvedValue(createFetchResponse({}, false, 404))

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result =
        await notificationsPreferencesViaEmailService.getPreferences('user123')

      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith('HTTP error! status: 404')

      consoleSpy.mockRestore()
    })

    it('should return null when network error occurs', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result =
        await notificationsPreferencesViaEmailService.getPreferences('user123')

      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith(new Error('Network error'))

      consoleSpy.mockRestore()
    })

    it('should return null when JSON parsing fails', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
      })

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result =
        await notificationsPreferencesViaEmailService.getPreferences('user123')

      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith(new Error('Invalid JSON'))

      consoleSpy.mockRestore()
    })
  })

  describe('setPreferences', () => {
    it('should send POST request with form data for preference updates', async () => {
      const mockResponse = createFetchResponse({ success: true })
      global.fetch = vi.fn().mockResolvedValue(mockResponse)

      const testData = {
        comments: true,
        replies: false,
        research_updates: true,
        userCode: 'user123',
      }

      const result =
        await notificationsPreferencesViaEmailService.setPreferences(testData)

      expect(fetch).toHaveBeenCalledWith(
        '/api/notifications-preferences-via-email/user123',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
        }),
      )

      const formData = (fetch as any).mock.calls[0][1].body
      expect(formData.get('comments')).toBe('true')
      expect(formData.get('replies')).toBe('false')
      expect(formData.get('research_updates')).toBe('true')
      expect(formData.get('is_unsubscribed')).toBe('false')
      expect(result).toBe(mockResponse)
    })

    it('should handle boolean false values correctly in form data', async () => {
      const mockResponse = createFetchResponse({ success: true })
      global.fetch = vi.fn().mockResolvedValue(mockResponse)

      const testData = {
        comments: false,
        replies: false,
        research_updates: false,
        userCode: 'user123',
      }

      await notificationsPreferencesViaEmailService.setPreferences(testData)

      const formData = (fetch as any).mock.calls[0][1].body
      expect(formData.get('comments')).toBe('false')
      expect(formData.get('replies')).toBe('false')
      expect(formData.get('research_updates')).toBe('false')
    })
  })

  describe('setUnsubscribe', () => {
    it('should send POST request with unsubscribe data including id when provided', async () => {
      const mockResponse = createFetchResponse({ success: true })
      global.fetch = vi.fn().mockResolvedValue(mockResponse)

      const result =
        await notificationsPreferencesViaEmailService.setUnsubscribe(
          'user123',
          456,
        )

      expect(fetch).toHaveBeenCalledWith(
        '/api/notifications-preferences-via-email/user123',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
        }),
      )

      const formData = (fetch as any).mock.calls[0][1].body
      expect(formData.get('id')).toBe('456')
      expect(formData.get('comments')).toBe('false')
      expect(formData.get('replies')).toBe('false')
      expect(formData.get('research_updates')).toBe('false')
      expect(formData.get('is_unsubscribed')).toBe('true')
      expect(result).toBe(mockResponse)
    })

    it('should send POST request without id when not provided', async () => {
      const mockResponse = createFetchResponse({ success: true })
      global.fetch = vi.fn().mockResolvedValue(mockResponse)

      await notificationsPreferencesViaEmailService.setUnsubscribe('user123')

      const formData = (fetch as any).mock.calls[0][1].body
      expect(formData.get('id')).toBeNull()
      expect(formData.get('comments')).toBe('false')
      expect(formData.get('replies')).toBe('false')
      expect(formData.get('research_updates')).toBe('false')
      expect(formData.get('is_unsubscribed')).toBe('true')
    })

    it('should handle undefined id parameter', async () => {
      const mockResponse = createFetchResponse({ success: true })
      global.fetch = vi.fn().mockResolvedValue(mockResponse)

      await notificationsPreferencesViaEmailService.setUnsubscribe(
        'user123',
        undefined,
      )

      const formData = (fetch as any).mock.calls[0][1].body
      expect(formData.get('id')).toBeNull()
    })
  })
})
