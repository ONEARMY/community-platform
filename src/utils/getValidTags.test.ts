import { describe, expect, it } from 'vitest'

import { getValidTags } from './getValidTags'

describe('getValidTags', () => {
  it('returns only true valid tags', () => {
    const tagIds = {
      uCzWZbz3aVKyx2keoqRi: true, // A valid tag
      J3LF7fMsDfniYT2ZX3rf: false, // A valid tag
      'not-a-tag': false,
    }
    const tags = getValidTags(tagIds)
    expect(tags.length).toEqual(1)
    expect(tags[0]._id).toEqual('uCzWZbz3aVKyx2keoqRi')
  })
})
