import { useState } from 'react'

import { SearchField } from './SearchField'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Forms/SearchField',
  component: SearchField,
} as Meta<typeof SearchField>

export const Default: StoryFn<typeof SearchField> = () => {
  const [searchValue, setSearchValue] = useState<string>('')

  return (
    <SearchField
      dataCy="default-search-box"
      placeHolder="Default search"
      value={searchValue}
      onChange={(value: string) => setSearchValue(value)}
      onClickDelete={() => setSearchValue('')}
      onClickSearch={() => {}}
    />
  )
}
