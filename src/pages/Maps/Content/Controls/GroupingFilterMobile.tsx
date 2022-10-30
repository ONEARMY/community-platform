import { Component } from 'react'
import checkmarkIcon from 'src/assets/icons/icon-checkmark.svg'

import type { MapsStore } from 'src/stores/Maps/maps.store'
import { Flex, Text, Image } from 'theme-ui'
import type { FilterGroup } from './transformAvailableFiltersToGroups'

interface IProps {
  items: FilterGroup[]
  selectedItems: Array<string>
  onChange?: (selectedItems: string[]) => void
}

interface IState {
  initialItems: Array<any>
}
interface IInjectedProps extends IProps {
  mapsStore: MapsStore
}

class GroupingFilterMobile extends Component<IProps, IState> {
  addOrRemove = (array, item) => {
    // from https://stackoverflow.com/a/52531625
    const exists = array.includes(item)
    if (exists) {
      return array.filter((c) => {
        return c !== item
      })
    } else {
      const result = array
      result.push(item)
      return result
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
      console.log(`handleChange`, { item })
      this.props.onChange(this.addOrRemove(this.props.selectedItems, item))
    }
  }

  render() {
    const { items, selectedItems } = this.props
    return (
      <Flex sx={{ flexDirection: 'column' }}>
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
      </Flex>
    )
  }
}

export { GroupingFilterMobile }
