import { Component } from 'react'
import type { MapsStore } from 'src/stores/Maps/maps.store'
import { Box } from 'theme-ui'
import { Select } from 'oa-components'
import type { FilterGroup } from './transformAvailableFiltersToGroups'

interface IProps {
  availableFilters: FilterGroup[]
  onChange: (selectedItems: string[]) => void
}
interface IInjectedProps extends IProps {
  mapsStore: MapsStore
}

class GroupingFilterDesktop extends Component<IProps> {
  constructor(props: IProps) {
    super(props)
  }
  get injected() {
    return this.props as IInjectedProps
  }

  render() {
    const onSelectChange = (selectedOptions) => {
      const arr = selectedOptions.map((option) => option.value)
      this.props.onChange(arr)
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
          options={this.props.availableFilters}
          onChange={onSelectChange}
          placeholder="Select filters"
        />
      </Box>
    )
  }
}

export { GroupingFilterDesktop }
