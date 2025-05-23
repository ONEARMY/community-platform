import { questionServiceServer } from 'src/services/questionService.server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockClient: any = {
  rpc: vi.fn(),
}

describe('getQuestionsByUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns array of questions', async () => {
    const id = 20
    const title = 'this is a test question?'
    const slug = 'this-is-a-test-question'
    const usefulCount = 1

    const mockDBQuestion = {
      id: id,
      title: title,
      slug: slug,
      total_useful: usefulCount,
    }

    const mockResponse = {
      error: null,
      data: [mockDBQuestion],
      count: null,
      status: 200,
      statusText: 'OK',
    }

    const expected = [
      {
        id: id,
        title: title,
        slug: slug,
        usefulCount: usefulCount,
      },
    ]

    mockClient.rpc.mockResolvedValueOnce(mockResponse)

    const result = await questionServiceServer.getQuestionsByUser(
      mockClient,
      'testuser',
    )

    expect(mockClient.rpc).toHaveBeenCalledWith('get_user_questions', {
      username_param: 'testuser',
    })
    expect(result).toEqual(expected)
  })

  it('returns empty array on error', async () => {
    const mockResponse = {
      error: new Error('RPC failed'),
      data: null,
    }

    mockClient.rpc.mockResolvedValueOnce(mockResponse)

    const result = await questionServiceServer.getQuestionsByUser(
      mockClient,
      'testuser',
    )

    expect(result).toEqual([])
  })

  it('returns empty array on empty response', async () => {
    const mockResponse = {
      error: null,
      data: [],
      count: null,
      status: 200,
      statusText: 'OK',
    }

    mockClient.rpc.mockResolvedValueOnce(mockResponse)

    const result = await questionServiceServer.getQuestionsByUser(
      mockClient,
      'testuser',
    )

    expect(result).toEqual([])
  })
})
