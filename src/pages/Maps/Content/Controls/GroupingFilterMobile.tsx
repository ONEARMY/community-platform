import { Component } from 'react'
import { Button } from 'oa-components'
import { Flex, Text, Image } from 'theme-ui'

import checkmarkIcon from 'src/assets/icons/icon-checkmark.svg'
import crossClose from 'src/assets/icons/cross-close.svg'

import type { MapsStore } from 'src/stores/Maps/maps.store'
import type { FilterGroup } from './transformAvailableFiltersToGroups'

interface IProps {
  items: FilterGroup[]
  selectedItems: Array<string>
  onChange?: (selectedItems: string[]) => void
  onClose: () => void
}

interface IState {
  initialItems: Array<any>
}
interface IInjectedProps extends IProps {
  mapsStore: MapsStore
}

class GroupingFilterMobile extends Component<IProps, IState> {
  addOrRemoveFilter = (selected, item) => {
    if (selected.includes(item)) {
      return selected.filter((selectedItem) => selectedItem !== item)
    } else {
      return [...selected, item]
    }
  }
  constructor(props: IProps) {
    super(props)
  }

  get injected() {
    return this.props as IInjectedProps
  }

  handleChange(item: string) {
    if (this.props.onChange) {
      this.props.onChange(
        this.addOrRemoveFilter(this.props.selectedItems, item),
      )
    }
  }

  render() {
    const { items, selectedItems } = this.props
    return (
      <Flex sx={{ flexDirection: 'column' }}>
        <Flex p={0} mx={-1} sx={{ justifyContent: 'space-between' }}>
          <Text sx={{ fontWeight: 'bold' }}>Select filters</Text>
          <Image
            loading="lazy"
            width="25px"
            src={crossClose}
            alt="cross-close"
            onClick={() => this.props.onClose()}
          />
        </Flex>

        {items.map((item, idx) => {
          return (
            <div key={idx}>
              <Text
                sx={{
                  fontSize: 2,
                  display: 'block',
                  paddingTop: 2,
                  paddingBottom: 2,
                }}
              >
                {item.label}
              </Text>

              {item.options.map((filter) => (
                <Flex
                  sx={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  mt="5px"
                  onClick={(evt) => {
                    evt.preventDefault()
                    evt.stopPropagation()
                    this.handleChange(filter.value)
                  }}
                  key={filter.label}
                >
                  <Flex sx={{ alignItems: 'center' }}>
                    {filter.imageElement}
                    <Text sx={{ fontSize: 2 }} ml="10px">
                      {filter.label} ({filter.number})
                    </Text>
                  </Flex>
                  {selectedItems.includes(filter.value) && (
                    <Image loading="lazy" src={checkmarkIcon} width="20px" />
                  )}
                </Flex>
              ))}
            </div>
          )
        })}

        <Button mt={3} onClick={this.props.onClose}>
          Apply filters
        </Button>
      </Flex>
    )
  }
}

export { GroupingFilterMobile }
