import { action, loader } from 'src/routes/api.notifications-preferences'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createMockSupabaseClient } from '../utils/supabaseClientMock'

import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router'

vi.mock('src/repository/supabase.server', () => ({
  createSupabaseServerClient: vi.fn(),
}))

const { createSupabaseServerClient } = vi.mocked(
  await import('src/repository/supabase.server'),
)

const createMockLoaderArgs = (request: Request): LoaderFunctionArgs => ({
  request,
  params: {},
  context: {},
  unstable_pattern: '',
})

const createMockActionArgs = (request: Request): ActionFunctionArgs => ({
  request,
  params: {},
  context: {},
  unstable_pattern: '',
})

describe('loader', () => {
  let mockClient: ReturnType<typeof createMockSupabaseClient>
  let mockRequest: Request

  beforeEach(() => {
    mockClient = createMockSupabaseClient()
    mockRequest = new Request('http://localhost/api/notifications-preferences')
    createSupabaseServerClient.mockReturnValue({
      client: mockClient.client,
      headers: new Headers(),
    })
  })

  it('returns user preferences when found', async () => {
    const mockClaims = { sub: 'user123' }
    const mockPreferences = {
      comments: false,
      replies: true,
      research_updates: false,
      is_unsubscribed: true,
    }

    mockClient.mocks.auth.getClaims.mockResolvedValue({
      data: { claims: mockClaims },
    })
    mockClient.mocks.single.mockResolvedValue({ data: mockPreferences })

    const response = await loader(createMockLoaderArgs(mockRequest))
    const result = await response.json()

    expect(response.status).toBe(200)
    expect(result).toEqual({ preferences: mockPreferences })
    expect(mockClient.mocks.from).toHaveBeenCalledWith(
      'notifications_preferences',
    )
    expect(mockClient.mocks.select).toHaveBeenCalledWith(
      '*, profiles!inner(id)',
    )
    expect(mockClient.mocks.eq).toHaveBeenCalledWith(
      'profiles.auth_id',
      'user123',
    )
    expect(mockClient.mocks.single).toHaveBeenCalled()
  })

  it('returns default preferences when no data found', async () => {
    const mockClaims = { sub: 'user123' }
    const defaultPreferences = {
      comments: true,
      replies: true,
      research_updates: true,
      is_unsubscribed: false,
    }

    mockClient.mocks.auth.getClaims.mockResolvedValue({
      data: { claims: mockClaims },
    })
    mockClient.mocks.single.mockResolvedValue({ data: null })

    const response = await loader(createMockLoaderArgs(mockRequest))
    const result = await response.json()

    expect(response.status).toBe(200)
    expect(result).toEqual({ preferences: defaultPreferences })
  })

  it('returns 401 when user is not authenticated', async () => {
    mockClient.mocks.auth.getClaims.mockResolvedValue({
      data: { claims: null },
    })

    const response = await loader(createMockLoaderArgs(mockRequest))

    expect(response.status).toBe(401)
  })
})

describe('action', () => {
  let mockClient: ReturnType<typeof createMockSupabaseClient>
  let mockRequest: Request

  beforeEach(() => {
    mockClient = createMockSupabaseClient()
    createSupabaseServerClient.mockReturnValue({
      client: mockClient.client,
      headers: new Headers(),
    })
    vi.stubEnv('TENANT_ID', 'test-tenant')
  })

  const createFormData = (data: Record<string, string>) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value)
    })
    return formData
  }

  it('updates existing preferences when id is provided', async () => {
    const mockUser = { id: 'user123' }
    const mockClaims = { sub: 'user123' }
    const formData = createFormData({
      id: '1',
      comments: 'false',
      replies: 'true',
      research_updates: 'false',
      is_unsubscribed: 'true',
    })

    mockRequest = new Request(
      'http://localhost/api/notifications-preferences',
      {
        method: 'POST',
        body: formData,
      },
    )

    mockClient.mocks.auth.getClaims.mockResolvedValue({
      data: { claims: mockClaims },
    })
    mockClient.mocks.select.mockResolvedValue({ data: mockUser })

    const response = await action(createMockActionArgs(mockRequest))

    expect(response.status).toBe(200)
    expect(mockClient.mocks.from).toHaveBeenCalledWith(
      'notifications_preferences',
    )
    expect(mockClient.mocks.update).toHaveBeenCalledWith({
      comments: false,
      replies: true,
      research_updates: false,
      is_unsubscribed: true,
    })
    expect(mockClient.mocks.eq).toHaveBeenCalledWith('id', 1)
    expect(mockClient.mocks.select).toHaveBeenCalled()
  })

  it('creates new preferences when id is not provided', async () => {
    const mockClaims = { sub: 'user123' }
    const mockProfile = { id: 456, auth_id: 'user123' }
    const formData = createFormData({
      comments: 'true',
      replies: 'false',
      research_updates: 'true',
      is_unsubscribed: 'false',
    })

    mockRequest = new Request(
      'http://localhost/api/notifications-preferences',
      {
        method: 'POST',
        body: formData,
      },
    )

    mockClient.mocks.auth.getClaims.mockResolvedValue({
      data: { claims: mockClaims },
    })
    mockClient.mocks.single.mockResolvedValue({ data: mockProfile })

    const response = await action(createMockActionArgs(mockRequest))

    expect(response.status).toBe(200)
    expect(mockClient.mocks.from).toHaveBeenCalledWith('profiles')
    expect(mockClient.mocks.select).toHaveBeenCalledWith('id, auth_id')
    expect(mockClient.mocks.eq).toHaveBeenCalledWith('auth_id', 'user123')
    expect(mockClient.mocks.insert).toHaveBeenCalledWith({
      user_id: 456,
      comments: true,
      replies: false,
      research_updates: true,
      is_unsubscribed: false,
      tenant_id: 'test-tenant',
    })
  })

  it('returns 401 when user is not authenticated', async () => {
    const formData = createFormData({
      comments: 'true',
      replies: 'true',
      research_updates: 'true',
      is_unsubscribed: 'false',
    })

    mockRequest = new Request(
      'http://localhost/api/notifications-preferences',
      {
        method: 'POST',
        body: formData,
      },
    )

    mockClient.mocks.auth.getClaims.mockResolvedValue({
      data: { claims: null },
    })

    const response = await action(createMockActionArgs(mockRequest))

    expect(response.status).toBe(401)
  })

  it('returns 500 for non-POST requests', async () => {
    const mockClaims = { sub: 'user123' }
    mockRequest = new Request(
      'http://localhost/api/notifications-preferences',
      {
        method: 'GET',
      },
    )

    mockClient.mocks.auth.getClaims.mockResolvedValue({
      data: { claims: mockClaims },
    })

    const response = await action(createMockActionArgs(mockRequest))

    expect(response.status).toBe(500)
  })

  it('returns 401 when user profile is not found during creation', async () => {
    const mockClaims = { sub: 'user123' }
    const formData = createFormData({
      comments: 'true',
      replies: 'true',
      research_updates: 'true',
      is_unsubscribed: 'false',
    })

    mockRequest = new Request(
      'http://localhost/api/notifications-preferences',
      {
        method: 'POST',
        body: formData,
      },
    )

    mockClient.mocks.auth.getClaims.mockResolvedValue({
      data: { claims: mockClaims },
    })
    mockClient.mocks.single.mockResolvedValue({ data: null })

    const response = await action(createMockActionArgs(mockRequest))

    expect(response.status).toBe(401)
    expect(response.statusText).toBe('User not found')
  })

  it('handles errors gracefully', async () => {
    const mockClaims = { sub: 'user123' }
    const formData = createFormData({
      comments: 'true',
      replies: 'true',
      research_updates: 'true',
      is_unsubscribed: 'false',
    })

    mockRequest = new Request(
      'http://localhost/api/notifications-preferences',
      {
        method: 'POST',
        body: formData,
      },
    )

    mockClient.mocks.auth.getClaims.mockResolvedValue({
      data: { claims: mockClaims },
    })
    mockClient.mocks.single.mockRejectedValue(new Error('Database error'))

    const response = await action(createMockActionArgs(mockRequest))

    expect(response.status).toBe(500)
    const result = await response.json()
    expect(result).toHaveProperty('error')
  })
})
