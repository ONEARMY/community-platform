import '@testing-library/jest-dom/vitest'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { render } from '../test/utils'
import { CategoryHorizonalList } from './CategoryHorizonalList'

import type { ContentType } from 'oa-shared'

const allCategoriesForPreciousPlastic = [
  {
    createdAt: new Date('2024-12-03T18:03:51.313Z'),
    id: 1,
    modifiedAt: null,
    name: 'Guides',
    type: 'questions' as ContentType,
  },
  {
    createdAt: new Date('2022-12-01T18:03:51.313Z'),
    id: 2,
    modifiedAt: null,
    name: 'Machines',
    type: 'questions' as ContentType,
  },
  {
    createdAt: new Date('2022-12-03T18:03:51.313Z'),
    id: 3,
    modifiedAt: null,
    name: 'Moulds',
    type: 'questions' as ContentType,
  },
  {
    createdAt: new Date('2022-12-03T18:03:51.313Z'),
    id: 4,
    modifiedAt: null,
    name: 'Products',
    type: 'questions' as ContentType,
  },
  {
    createdAt: new Date('2022-12-03T18:03:51.313Z'),
    id: 5,
    modifiedAt: null,
    name: 'Starter Kits',
    type: 'questions' as ContentType,
  },
  {
    createdAt: new Date('2022-12-04T18:03:51.313Z'),
    id: 6,
    modifiedAt: null,
    name: 'Recycling',
    type: 'questions' as ContentType,
  },
  {
    createdAt: new Date('2022-12-05T18:03:51.313Z'),
    id: 7,
    modifiedAt: null,
    name: 'Version 5',
    type: 'questions' as ContentType,
  },
]

const allCategoriesForProjectKamp = [
  {
    createdAt: new Date('2022-12-03T18:03:51.313Z'),
    id: 8,
    modifiedAt: null,
    name: 'Construction',
    type: 'questions' as ContentType,
  },
  {
    createdAt: new Date('2022-12-03T18:03:51.313Z'),
    id: 9,
    modifiedAt: null,
    name: 'Food',
    type: 'questions' as ContentType,
  },
  {
    createdAt: new Date('2022-12-03T18:03:51.313Z'),
    id: 10,
    modifiedAt: null,
    name: 'Landscape',
    type: 'questions' as ContentType,
  },
  {
    createdAt: new Date('2022-12-03T18:03:51.313Z'),
    id: 11,
    modifiedAt: null,
    name: 'Other',
    type: 'questions' as ContentType,
  },
  {
    createdAt: new Date('2022-12-03T18:03:51.313Z'),
    id: 12,
    modifiedAt: null,
    name: 'Utilities',
    type: 'questions' as ContentType,
  },
]

describe('CategoryHorizonalList', () => {
  // https://stackoverflow.com/a/62148101
  beforeEach(() => {
    window.IntersectionObserver = vi.fn().mockImplementation(function () {
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      }
    })
  })

  it('renders each member type given', async () => {
    const allCategories = [
      ...allCategoriesForPreciousPlastic,
      ...allCategoriesForProjectKamp,
    ]

    const { findAllByTestId } = render(
      <CategoryHorizonalList
        activeCategory={null}
        allCategories={allCategories}
        setActiveCategory={vi.fn()}
      />,
    )

    const allItems = await findAllByTestId('CategoryHorizonalList-Item')

    expect(allItems).toHaveLength(12)
  })

  it('orders by _created with oldest first', async () => {
    const allCategories = [
      ...allCategoriesForPreciousPlastic,
      ...allCategoriesForProjectKamp,
    ]

    const { findAllByTestId } = render(
      <CategoryHorizonalList
        activeCategory={null}
        allCategories={allCategories}
        setActiveCategory={vi.fn()}
      />,
    )

    const allItems = await findAllByTestId('CategoryHorizonalList-Item')

    expect(allItems[0].title).toEqual('Machines')
    expect(allItems[11].title).toEqual('Guides')
  })

  it('renders default category glyph when specific glyph is missing', async () => {
    const noGlyphCategories = [
      {
        createdAt: new Date('2022-12-03T18:03:51.313Z'),
        id: 13,
        modifiedAt: null,
        name: 'No Glphy A',
        type: 'questions' as ContentType,
      },
      {
        createdAt: new Date('2022-12-03T18:03:51.313Z'),
        id: 14,
        modifiedAt: null,
        name: 'No Glphy B',
        type: 'questions' as ContentType,
      },
      {
        createdAt: new Date('2022-12-03T18:03:51.313Z'),
        id: 15,
        modifiedAt: null,
        name: 'No Glphy C',
        type: 'questions' as ContentType,
      },
    ]

    const { findAllByTestId } = render(
      <CategoryHorizonalList
        activeCategory={null}
        allCategories={noGlyphCategories}
        setActiveCategory={vi.fn()}
      />,
    )

    const allItems = await findAllByTestId('category-icon')

    expect(allItems).toHaveLength(3)
  })

  it("doesn't render items when less than three at present", () => {
    const twoCategories = [
      allCategoriesForPreciousPlastic[0],
      allCategoriesForPreciousPlastic[1],
    ]

    const { getByTestId } = render(
      <CategoryHorizonalList
        activeCategory={null}
        allCategories={twoCategories}
        setActiveCategory={vi.fn()}
      />,
    )

    expect(() => getByTestId('MemberTypeVerticalList-Item')).toThrow()
  })
})
