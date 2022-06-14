import { inject } from 'mobx-react'
import { MemberBadge } from 'oa-components'
import { Component } from 'react'
import checkmarkIcon from 'src/assets/icons/icon-checkmark.svg'
import type { IMapGrouping } from 'src/models/maps.models'
import type { MapsStore } from 'src/stores/Maps/maps.store'
import { Flex, Image, Text } from 'theme-ui'
import { transformSpecialistWorkspaceTypeToWorkspace } from './transformSpecialistWorkspaceTypeToWorkspace'

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
      return array.filter((c) => {
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
      .filter((item) => {
        return !item.hidden
      })
      .map((item) => ({
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
      <Flex sx={{ flexDirection: 'column' }}>
        <Text
          sx={{
            fontSize: 2,
            display: 'block',
            paddingTop: 2,
            paddingBottom: 2,
          }}
        >
          {entityType === 'place' ? 'All Workspaces' : 'Others'}
        </Text>
        {options.map((filter) => (
          <Flex
            sx={{ alignItems: 'center', justifyContent: 'space-between' }}
            mt="5px"
            onClick={(evt) => {
              evt.preventDefault()
              evt.stopPropagation()
              this.handleChange(filter.value)
            }}
            key={filter.label}
          >
            <Flex sx={{ alignItems: 'center' }}>
              <MemberBadge
                profileType={transformSpecialistWorkspaceTypeToWorkspace(
                  filter.value,
                )}
                size={30}
              />
              <Text sx={{ fontSize: 2 }} ml="10px">
                {filter.label} ({filter.number})
              </Text>
            </Flex>
            {selectedItems.includes(filter.value) && (
              <Image loading="lazy" src={checkmarkIcon} width="20px" />
            )}
          </Flex>
        ))}
      </Flex>
    )
  }
}

export { GroupingFilterMobile }
