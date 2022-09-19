import { Component } from 'react'
import checkmarkIcon from 'src/assets/icons/icon-checkmark.svg'
import type { MapsStore } from 'src/stores/Maps/maps.store'
import { Box, Flex, Image, Text } from 'theme-ui'
import { Select } from 'oa-components'
import type { FilterGroup } from './transformAvailableFiltersToGroups'

interface IProps {
  items: FilterGroup[]
  onChange: (selectedItems: string[]) => void
  selectedItems: Array<string>
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
    const { items, selectedItems } = this.props
    const groupedOptions = items
    const optionsRender = (option, formatOptionLabelMeta) => {
      if (formatOptionLabelMeta.context === 'value') {
        return option.label
      }
      return (
        <Flex
          sx={{ alignItems: 'center', justifyContent: 'space-between' }}
          mt="5px"
          key={option.label}
        >
          <Flex sx={{ alignItems: 'center' }}>
            {option.imageElement}
            <Text sx={{ fontSize: 2 }} ml="10px">
              {option.label} ({option.number})
            </Text>
          </Flex>
          {selectedItems.includes(option.value) && (
            <Image loading="lazy" src={checkmarkIcon} width="20px" />
          )}
        </Flex>
      )
    }

    const onSelectChange = (selectedOptions) => {
      const arr = selectedOptions.map((option) => option.value)
      this.props.onChange(arr)
    }

    return (
      <Box
        sx={{
          display: ['none', 'block', 'block'],
          width: '308px',
          height: '45px',
          m: [0, '5px 0 0 20px'],
        }}
      >
        <Select
          variant="icons"
          isMulti
          options={groupedOptions}
          onChange={onSelectChange}
          formatOptionLabel={optionsRender}
          placeholder="Select filters"
        />
      </Box>
    )
  }
}

export { GroupingFilterDesktop }
