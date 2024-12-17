import { useState } from 'react'

import { CategoryVerticalList } from './CategoryVerticalList'

import type { Meta, StoryFn } from '@storybook/react'
import type { ICategory } from 'oa-shared'

export default {
  title: 'Components/CategoryVerticalList',
  component: CategoryVerticalList,
} as Meta<typeof CategoryVerticalList>

export const Default: StoryFn<typeof CategoryVerticalList> = () => {
  const [activeCategory, setActiveCategory] = useState<ICategory | null>(null)
  const allCategories = [
    {
      _created: '2022-12-03T18:03:51.313Z',
      _deleted: false,
      _id: '78XHeJmfQISA7tfBnDs1',
      _modified: '2022-12-03T18:03:51.313Z',
      label: 'Guides',
    },
    {
      _created: '2022-12-03T18:03:51.313Z',
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

  return (
    <CategoryVerticalList
      activeCategory={activeCategory}
      allCategories={allCategories}
      setActiveCategory={setActiveCategory}
    />
  )
}
