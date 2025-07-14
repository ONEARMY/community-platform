import { vi } from 'vitest'

import type { SupabaseClient } from '@supabase/supabase-js'

export const createMockSupabaseClient = () => {
  const mockSingle = vi.fn()
  const mockMaybeSingle = vi.fn()
  const mockEq = vi.fn()
  const mockSelect = vi.fn()
  const mockFrom = vi.fn()
  const mockRpc = vi.fn()
  const mockFunctionsInvoke = vi.fn()
  const mockUpdate = vi.fn()
  const mockInsert = vi.fn()
  const mockDelete = vi.fn()
  const mockLimit = vi.fn()
  const mockGetUser = vi.fn()

  const mockClient = {
    auth: {
      getUser: mockGetUser,
    },
    from: mockFrom,
    rpc: mockRpc,
    functions: {
      invoke: mockFunctionsInvoke,
    },
  } as unknown as SupabaseClient

  const createQueryBuilder = () => ({
    select: mockSelect,
    eq: mockEq,
    single: mockSingle,
    maybeSingle: mockMaybeSingle,
    update: mockUpdate,
    insert: mockInsert,
    delete: mockDelete,
    limit: mockLimit,
  })

  mockFrom.mockImplementation(() => createQueryBuilder())
  mockSelect.mockImplementation(() => createQueryBuilder())
  mockEq.mockImplementation(() => createQueryBuilder())
  mockUpdate.mockImplementation(() => createQueryBuilder())
  mockInsert.mockImplementation(() => createQueryBuilder())
  mockDelete.mockImplementation(() => createQueryBuilder())
  mockLimit.mockImplementation(() => createQueryBuilder())

  return {
    client: mockClient,
    mocks: {
      auth: {
        getUser: mockGetUser,
      },
      from: mockFrom,
      select: mockSelect,
      eq: mockEq,
      single: mockSingle,
      maybeSingle: mockMaybeSingle,
      update: mockUpdate,
      insert: mockInsert,
      delete: mockDelete,
      limit: mockLimit,
      rpc: mockRpc,
      functionsInvoke: mockFunctionsInvoke,
    },
  }
}
