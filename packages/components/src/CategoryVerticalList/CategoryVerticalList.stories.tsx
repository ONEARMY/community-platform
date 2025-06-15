import { useState } from 'react'

import { CategoryVerticalList } from './CategoryVerticalList'

import type { Meta, StoryFn } from '@storybook/react'
import type { Category, ContentType } from 'oa-shared'

export default {
  title: 'Components/CategoryVerticalList',
  component: CategoryVerticalList,
} as Meta<typeof CategoryVerticalList>

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
    name: 'From the Team',
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

export const Basic: StoryFn<typeof CategoryVerticalList> = () => {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null)
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
  const [activeCategory, setActiveCategory] = useState<Category | null>(null)
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
  const [activeCategory, setActiveCategory] = useState<Category | null>(null)

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
