import type { IMapPin } from 'src/models'
import { filterMapPinsByType } from './filter'

describe('filterMapPinsByType', () => {
  it('excludes deleted items', () => {
    const mapPins: Partial<IMapPin>[] = [{ _deleted: true, type: 'member' }]
    expect(filterMapPinsByType(mapPins as IMapPin[], ['member'])).toHaveLength(
      0,
    )
  })

  it('excludes deleted verified items', () => {
    const mapPins: Partial<IMapPin>[] = [
      { _deleted: true, type: 'member', verified: true },
    ]
    expect(
      filterMapPinsByType(mapPins as IMapPin[], ['verified']),
    ).toHaveLength(0)
  })

  it('only returns item which match the filter', () => {
    const mapPins: Partial<IMapPin>[] = [
      { _deleted: false, type: 'member' },
      { _deleted: false, type: 'machine-builder' },
    ]
    expect(filterMapPinsByType(mapPins as IMapPin[], ['member'])).toHaveLength(
      1,
    )
  })

  it('returns only verified pins', () => {
    const mapPins: Partial<IMapPin>[] = [
      { _deleted: false, type: 'member', verified: true },
      { _deleted: false, type: 'machine-builder' },
    ]
    expect(
      filterMapPinsByType(mapPins as IMapPin[], ['verified']),
    ).toHaveLength(1)
  })

  it('returns verified pins if they are a member', () => {
    const mapPins: Partial<IMapPin>[] = [
      { _deleted: false, type: 'member', verified: true },
      { _deleted: false, type: 'machine-builder', verified: true },
    ]
    expect(
      filterMapPinsByType(mapPins as IMapPin[], ['verified', 'member']),
    ).toHaveLength(1)
  })
})
