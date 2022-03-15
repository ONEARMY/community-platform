import { Component } from 'react';
import Text from 'src/components/Text'
import { IMapGrouping } from 'src/models/maps.models'
import checkmarkIcon from 'src/assets/icons/icon-checkmark.svg'
import { Flex, Image } from 'rebass'
import { inject } from 'mobx-react'
import { MapsStore } from 'src/stores/Maps/maps.store'

interface IProps {
  items: Array<IMapGrouping>
  entityType: string
  onChange?: (selectedItems: string[]) => void
  selectedItems: Array<string>
}

interface IState {
  initialItems: Array<any>
}
interface IInjectedProps extends IProps {
  mapsStore: MapsStore
}

@inject('mapsStore')
class GroupingFilterMobile extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      initialItems: this.asOptions(props.items),
    }
  }

  get injected() {
    return this.props as IInjectedProps
  }

  addOrRemove = (array, item) => {
    // from https://stackoverflow.com/a/52531625
    const exists = array.includes(item)
    if (exists) {
      return array.filter(c => {
        return c !== item
      })
    } else {
      const result = array
      result.push(item)
      return result
    }
  }

  handleChange(item: string) {
    if (this.props.onChange) {
      this.props.onChange(this.addOrRemove(this.props.selectedItems, item))
    }
  }

  asOptions(items: Array<IMapGrouping>) {
    return items
      .filter(item => {
        return !item.hidden
      })
      .map(item => ({
        label: item.displayName,
        value: item.subType ? item.subType : item.type,
        icon: item.icon,
        number: this.injected.mapsStore.getPinsNumberByFilterType(
          item.subType ? item.subType.split(' ') : item.type.split(' '),
        ),
      }))
  }

  render() {
    const { items, entityType } = this.props
    const options = this.asOptions(items)
    const { selectedItems } = this.props

    return (
      <Flex flexDirection="column">
        <Text medium py="10px">
          {entityType === 'place' ? 'All Workspaces' : 'Others'}
        </Text>
        {options.map(filter => (
          <Flex
            alignItems="center"
            justifyContent="space-between"
            mt="5px"
            onClick={evt => {
              evt.preventDefault()
              evt.stopPropagation()
              this.handleChange(filter.value)
            }}
            key={filter.label}
          >
            <Flex alignItems="center">
              <Image width="30px" src={filter.icon} />
              <Text medium ml="10px">
                {filter.label} ({filter.number})
              </Text>
            </Flex>
            {selectedItems.includes(filter.value) && (
              <Image src={checkmarkIcon} width="20px" />
            )}
          </Flex>
        ))}
      </Flex>
    )
  }
}

export { GroupingFilterMobile }
