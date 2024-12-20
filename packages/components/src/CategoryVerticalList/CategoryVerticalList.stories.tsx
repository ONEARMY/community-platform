import { useState } from 'react'

import { CategoryVerticalList } from './CategoryVerticalList'

import type { Meta, StoryFn } from '@storybook/react'
import type { ICategory } from 'oa-shared'

export default {
  title: 'Components/CategoryVerticalList',
  component: CategoryVerticalList,
} as Meta<typeof CategoryVerticalList>

const allCategoriesForPreciousPlastic = [
  {
    _created: '2024-12-03T18:03:51.313Z',
    _deleted: false,
    _id: '78XHeJmfQISA7tfBnDs1',
    _modified: '2022-12-03T18:03:51.313Z',
    label: 'Guides',
  },
  {
    _created: '2022-12-01T18:03:51.313Z',
    _deleted: false,
    _id: '78XHeJmfQISA7tfBnDsL',
    _modified: '2022-12-03T18:03:51.313Z',
    label: 'Machines',
  },
  {
    _created: '2022-12-03T18:03:51.313Z',
    _deleted: false,
    _id: '78XHeJmfQISA7tfBnDaL',
    _modified: '2022-12-03T18:03:51.313Z',
    label: 'Moulds',
  },
  {
    _created: '2022-12-03T18:03:51.313Z',
    _deleted: false,
    _id: '78XHeamfQISA7tfBnDaL',
    _modified: '2022-12-03T18:03:51.313Z',
    label: 'Products',
  },
  {
    _created: '2022-12-03T18:03:51.313Z',
    _deleted: false,
    _id: '78XHeamfjISA7tfBnDaL',
    _modified: '2022-12-03T18:03:51.313Z',
    label: 'Starter Kits',
  },
]

const allCategoriesForProjectKamp = [
  {
    _created: '2022-12-03T18:03:51.313Z',
    _deleted: false,
    _id: '744674',
    _modified: '2022-12-03T18:03:51.313Z',
    label: 'Construction',
  },
  {
    _created: '2022-12-03T18:03:51.313Z',
    _deleted: false,
    _id: 'hgdfr',
    _modified: '2022-12-03T18:03:51.313Z',
    label: 'Food',
  },
  {
    _created: '2022-12-03T18:03:51.313Z',
    _deleted: false,
    _id: '45378bdfg',
    _modified: '2022-12-03T18:03:51.313Z',
    label: 'Landscape',
  },
  {
    _created: '2022-12-03T18:03:51.313Z',
    _deleted: false,
    _id: 'sebnt5w3',
    _modified: '2022-12-03T18:03:51.313Z',
    label: 'Other',
  },
  {
    _created: '2022-12-03T18:03:51.313Z',
    _deleted: false,
    _id: 'hwdfgiu52',
    _modified: '2022-12-03T18:03:51.313Z',
    label: 'Utilities',
  },
]

export const Basic: StoryFn<typeof CategoryVerticalList> = () => {
  const [activeCategory, setActiveCategory] = useState<ICategory | null>(null)
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
  const [activeCategory, setActiveCategory] = useState<ICategory | null>(null)
  const noGlyphCategories = [
    {
      _created: '2022-12-03T18:03:51.313Z',
      _deleted: false,
      _id: '78XHeamfQISA7tfBnDaL',
      _modified: '2022-12-03T18:03:51.313Z',
      label: 'No Glphy A',
    },
    {
      _created: '2022-12-03T18:03:51.313Z',
      _deleted: false,
      _id: '36dgbhs',
      _modified: '2022-12-03T18:03:51.313Z',
      label: 'No Glphy B',
    },
    {
      _created: '2022-12-03T18:03:51.313Z',
      _deleted: false,
      _id: '36dgbhs',
      _modified: '2022-12-03T18:03:51.313Z',
      label: 'No Glphy C',
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
  const [activeCategory, setActiveCategory] = useState<ICategory | null>(null)

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
