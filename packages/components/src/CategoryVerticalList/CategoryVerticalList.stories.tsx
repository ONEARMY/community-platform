import { useState } from 'react'

import { CategoryVerticalList } from './CategoryVerticalList'

import type { Meta, StoryFn } from '@storybook/react'
import type { Category, ContentTypes, ICategory } from 'oa-shared'

export default {
  title: 'Components/CategoryVerticalList',
  component: CategoryVerticalList,
} as Meta<typeof CategoryVerticalList>

const allCategoriesForPreciousPlastic = [
  {
    createdAt: new Date('2024-12-03T18:03:51.313Z'),
    id: 1,
    name: 'Guides',
    type: 'questions' as ContentTypes,
  },
  {
    createdAt: new Date('2022-12-01T18:03:51.313Z'),
    id: 2,
    name: 'Machines',
    type: 'questions' as ContentTypes,
  },
  {
    createdAt: new Date('2022-12-03T18:03:51.313Z'),
    id: 3,
    name: 'Moulds',
    type: 'questions' as ContentTypes,
  },
  {
    createdAt: new Date('2022-12-03T18:03:51.313Z'),
    id: 4,
    name: 'Products',
    type: 'questions' as ContentTypes,
  },
  {
    createdAt: new Date('2022-12-03T18:03:51.313Z'),
    id: 5,
    name: 'Starter Kits',
    type: 'questions' as ContentTypes,
  },
  {
    createdAt: new Date('2022-12-04T18:03:51.313Z'),
    id: 6,
    name: 'Recycling',
    type: 'questions' as ContentTypes,
  },
  {
    createdAt: new Date('2022-12-05T18:03:51.313Z'),
    id: 7,
    _modified: '2022-12-03T18:03:51.313Z',
    name: 'From the Team',
    type: 'questions' as ContentTypes,
  },
]

const allCategoriesForProjectKamp = [
  {
    createdAt: new Date('2022-12-03T18:03:51.313Z'),
    id: 8,
    name: 'Construction',
    type: 'questions' as ContentTypes,
  },
  {
    createdAt: new Date('2022-12-03T18:03:51.313Z'),
    id: 9,
    name: 'Food',
    type: 'questions' as ContentTypes,
  },
  {
    createdAt: new Date('2022-12-03T18:03:51.313Z'),
    id: 10,
    name: 'Landscape',
    type: 'questions' as ContentTypes,
  },
  {
    createdAt: new Date('2022-12-03T18:03:51.313Z'),
    id: 11,
    name: 'Other',
    type: 'questions' as ContentTypes,
  },
  {
    createdAt: new Date('2022-12-03T18:03:51.313Z'),
    id: 12,
    name: 'Utilities',
    type: 'questions' as ContentTypes,
  },
]

export const Basic: StoryFn<typeof CategoryVerticalList> = () => {
  const [activeCategory, setActiveCategory] = useState<
    Category | ICategory | null
  >(null)
  const allCategories = [
    ...allCategoriesForPreciousPlastic,
    ...allCategoriesForProjectKamp,
  ]

  return (
    <div style={{ maxWidth: '500px' }}>
      <CategoryVerticalList
        activeCategory={activeCategory}
        allCategories={allCategories}
        setActiveCategory={setActiveCategory}
      />
    </div>
  )
}

export const WhenGlyphNotPresent: StoryFn<typeof CategoryVerticalList> = () => {
  const [activeCategory, setActiveCategory] = useState<
    Category | ICategory | null
  >(null)
  const noGlyphCategories = [
    {
      createdAt: new Date('2022-12-03T18:03:51.313Z'),
      id: 13,
      name: 'No Glphy A',
      type: 'questions' as ContentTypes,
    },
    {
      createdAt: new Date('2022-12-03T18:03:51.313Z'),
      id: 14,
      name: 'No Glphy B',
      type: 'questions' as ContentTypes,
    },
    {
      createdAt: new Date('2022-12-03T18:03:51.313Z'),
      id: 15,
      name: 'No Glphy C',
      type: 'questions' as ContentTypes,
    },
  ]

  return (
    <div style={{ maxWidth: '500px' }}>
      <CategoryVerticalList
        activeCategory={activeCategory}
        allCategories={noGlyphCategories}
        setActiveCategory={setActiveCategory}
      />
    </div>
  )
}

export const OnlyOne: StoryFn<typeof CategoryVerticalList> = () => {
  const [activeCategory, setActiveCategory] = useState<
    Category | ICategory | null
  >(null)

  const twoCategories = [
    allCategoriesForPreciousPlastic[0],
    allCategoriesForPreciousPlastic[1],
  ]

  return (
    <div style={{ maxWidth: '500px' }}>
      <CategoryVerticalList
        activeCategory={activeCategory}
        allCategories={twoCategories}
        setActiveCategory={setActiveCategory}
      />
      (Shouldn't see anything, only renders for two or more)
    </div>
  )
}
