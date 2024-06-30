import React from 'react'
import { Select } from '@onearmy.apps/components'
import { Box } from 'theme-ui'

import type { FilterGroup } from './transformAvailableFiltersToGroups'

interface IProps {
  availableFilters: FilterGroup[]
  onChange: (selectedItems: string[]) => void
}

export const GroupingFilterDesktop = (props: IProps) => {
  const onSelectChange = (selectedOptions) => {
    const arr = selectedOptions.map((option) => option.value)
    props.onChange(arr)
  }

  return (
    <Box
      sx={{
        display: ['none', 'none', 'block'],
        width: '308px',
        height: '45px',
        m: [0, '5px 0 0 20px'],
      }}
    >
      <Select
        variant="icons"
        isMulti
        isClearable
        options={props.availableFilters}
        onChange={onSelectChange}
        placeholder="Select filters"
      />
    </Box>
  )
}
