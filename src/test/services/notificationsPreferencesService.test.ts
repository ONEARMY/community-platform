import { notificationsPreferencesService } from 'src/services/notificationsPreferencesService'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockFetch = vi.fn()
global.fetch = mockFetch

const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

describe('notificationsPreferencesService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getPreferences', () => {
    it('returns preferences when fetch succeeds', async () => {
      const mockPreferences = { id: 1, comments: true, replies: false }
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ preferences: mockPreferences }),
      })

      const result = await notificationsPreferencesService.getPreferences()

      expect(mockFetch).toHaveBeenCalledWith('/api/notifications-preferences')
      expect(result).toEqual(mockPreferences)
    })

    it('returns null when fetch fails', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      const result = await notificationsPreferencesService.getPreferences()

      expect(result).toBeNull()
      expect(mockConsoleError).toHaveBeenCalledWith(expect.any(Error))
    })

    it('returns null when json parsing fails', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.reject(new Error('Invalid JSON')),
      })

      const result = await notificationsPreferencesService.getPreferences()

      expect(result).toBeNull()
      expect(mockConsoleError).toHaveBeenCalledWith(expect.any(Error))
    })
  })

  describe('setPreferences', () => {
    it('sends correct FormData when id is provided', async () => {
      const mockResponse = { ok: true }
      mockFetch.mockResolvedValue(mockResponse)

      const formData = {
        id: 123,
        comments: true,
        replies: false,
        research_updates: true,
      }

      const result =
        await notificationsPreferencesService.setPreferences(formData)

      expect(mockFetch).toHaveBeenCalledWith('/api/notifications-preferences', {
        method: 'POST',
        body: expect.any(FormData),
      })

      const [, options] = mockFetch.mock.calls[0]
      const body = options.body as FormData

      expect(body.get('id')).toBe('123')
      expect(body.get('comments')).toBe('true')
      expect(body.get('replies')).toBe('false')
      expect(body.get('research_updates')).toBe('true')
      expect(body.get('is_unsubscribed')).toBe('false')
      expect(result).toBe(mockResponse)
    })

    it('sends correct FormData when id is not provided', async () => {
      const mockResponse = { ok: true }
      mockFetch.mockResolvedValue(mockResponse)

      const formData = {
        comments: false,
        replies: true,
        research_updates: false,
      }

      await notificationsPreferencesService.setPreferences(formData)
      const [, options] = mockFetch.mock.calls[0]
      const body = options.body as FormData

      expect(body.get('id')).toBeNull()
      expect(body.get('comments')).toBe('false')
      expect(body.get('replies')).toBe('true')
      expect(body.get('research_updates')).toBe('false')
      expect(body.get('is_unsubscribed')).toBe('false')
    })

    it('sends correct FormData when id is undefined', async () => {
      mockFetch.mockResolvedValue({ ok: true })

      const formData = {
        id: undefined,
        comments: true,
        replies: true,
        research_updates: true,
      }

      await notificationsPreferencesService.setPreferences(formData)
      const [, options] = mockFetch.mock.calls[0]
      const body = options.body as FormData

      expect(body.get('id')).toBeNull()
    })
  })

  describe('setUnsubscribe', () => {
    it('sends correct FormData with all preferences disabled when id is provided', async () => {
      const mockResponse = { ok: true }
      mockFetch.mockResolvedValue(mockResponse)

      const result = await notificationsPreferencesService.setUnsubscribe(456)

      expect(mockFetch).toHaveBeenCalledWith('/api/notifications-preferences', {
        method: 'POST',
        body: expect.any(FormData),
      })

      const [, options] = mockFetch.mock.calls[0]
      const body = options.body as FormData

      expect(body.get('id')).toBe('456')
      expect(body.get('comments')).toBe('false')
      expect(body.get('replies')).toBe('false')
      expect(body.get('research_updates')).toBe('false')
      expect(body.get('is_unsubscribed')).toBe('true')
      expect(result).toBe(mockResponse)
    })

    it('sends correct FormData without id when id is undefined', async () => {
      mockFetch.mockResolvedValue({ ok: true })

      await notificationsPreferencesService.setUnsubscribe(undefined)

      const [, options] = mockFetch.mock.calls[0]
      const body = options.body as FormData

      expect(body.get('id')).toBeNull()
      expect(body.get('comments')).toBe('false')
      expect(body.get('replies')).toBe('false')
      expect(body.get('research_updates')).toBe('false')
      expect(body.get('is_unsubscribed')).toBe('true')
    })
  })
})
