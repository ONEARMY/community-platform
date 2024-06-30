import { describe, expect, it, vi } from 'vitest'

import { incrementViewCount } from '../utils/incrementViewCount'

describe('incrementViewCount', () => {
  it('calls the store incrementor', async () => {
    const document = {
      _id: 'dfghdxhg',
      total_views: 42,
    }

    const store = {
      incrementViewCount: vi.fn(),
    } as any

    await incrementViewCount({
      document,
      documentType: 'howto',
      store,
    })

    expect(store.incrementViewCount).toHaveBeenCalledWith(document)
  })

  it('only calls the incrementor once', async () => {
    const document = {
      _id: 'j343tdf',
      total_views: 55,
    }

    const store = {
      incrementViewCount: vi.fn(),
    } as any

    await incrementViewCount({
      document,
      documentType: 'howto',
      store,
    })
    await incrementViewCount({
      document,
      documentType: 'howto',
      store,
    })

    expect(store.incrementViewCount).toHaveBeenCalledTimes(1)
  })
})
