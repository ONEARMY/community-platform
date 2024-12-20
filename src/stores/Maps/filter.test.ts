import { describe, expect, it } from 'vitest'

import { filterMapPinsByType } from './filter'

import type { IMapPin } from 'oa-shared'

describe('filterMapPinsByType', () => {
  it('excludes deleted items', () => {
    const mapPins: Partial<IMapPin>[] = [{ _deleted: true, type: 'member' }]
    expect(
      filterMapPinsByType(mapPins as IMapPin[], ['member'], false),
    ).toHaveLength(0)
  })

  it('excludes deleted verified items', () => {
    const mapPins: Partial<IMapPin>[] = [
      { _deleted: true, type: 'member', verified: true },
    ]
    expect(
      filterMapPinsByType(mapPins as IMapPin[], ['verified'], false),
    ).toHaveLength(0)
  })

  it('only returns item which match the filter', () => {
    const mapPins: Partial<IMapPin>[] = [
      { _deleted: false, type: 'member' },
      { _deleted: false, type: 'machine-builder' },
    ]
    expect(
      filterMapPinsByType(mapPins as IMapPin[], ['member'], false),
    ).toHaveLength(1)
  })

  it('returns only verified pins', () => {
    const mapPins: Partial<IMapPin>[] = [
      { _deleted: false, type: 'collection-point', verified: true },
      { _deleted: false, type: 'machine-builder' },
    ]
    expect(
      filterMapPinsByType(mapPins as IMapPin[], ['verified'], false),
    ).toHaveLength(1)
  })

  it('returns verified pins if they are a member', () => {
    const mapPins: Partial<IMapPin>[] = [
      { _deleted: false, type: 'member', verified: true },
      { _deleted: false, type: 'machine-builder', verified: true },
    ]
    expect(
      filterMapPinsByType(mapPins as IMapPin[], ['verified', 'member'], false),
    ).toHaveLength(1)
  })
})
