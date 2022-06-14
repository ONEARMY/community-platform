import { Component } from 'react'
import Select, { components } from 'react-select'
import type { MultiValueRemoveProps } from 'react-select/lib/components/MultiValue'
import checkmarkIcon from 'src/assets/icons/icon-checkmark.svg'
import { DropdownIndicator } from 'src/components/DropdownIndicator'
import type { IMapGrouping, IPinGrouping } from 'src/models/maps.models'
import { inject } from 'mobx-react'
import type { MapsStore } from 'src/stores/Maps/maps.store'
import { Box, Flex, Image, Text } from 'theme-ui'
import { SelectStyles } from 'src/components/Form/Select.field'
import { MemberBadge } from 'oa-components'
import { transformSpecialistWorkspaceTypeToWorkspace } from './transformSpecialistWorkspaceTypeToWorkspace'

interface IProps {
  items: Record<IPinGrouping, Array<IMapGrouping>>
  onChange: (selectedItems: string[]) => void
  selectedItems: Array<string>
}

interface IState {
  initialItems: Array<any>
}
interface IInjectedProps extends IProps {
  mapsStore: MapsStore
}

interface FilterOption {
  label: string
  value: string
  icon: string
  number: number
}

const MultiValueRemove = (props: MultiValueRemoveProps<FilterOption>) => {
  return <components.MultiValueRemove {...props}> </components.MultiValueRemove>
}

@inject('mapsStore')
class GroupingFilterDesktop extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      initialItems: this.transform(props.items),
    }
  }
  get injected() {
    return this.props as IInjectedProps
  }

  transform = (items: Record<IPinGrouping, Array<IMapGrouping>>) => {
    return Object.keys(items).map((item) => {
      return {
        label: item === 'place' ? 'All Workspaces' : 'Others',
        options: this.asOptions(items[item]),
      }
    })
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
    const { items, selectedItems } = this.props
    const groupedOptions = this.transform(items)
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
            <MemberBadge
              profileType={transformSpecialistWorkspaceTypeToWorkspace(
                option.value,
              )}
              size={30}
            />
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
          components={{ DropdownIndicator, MultiValueRemove }}
          isMulti
          styles={{
            ...SelectStyles,
            multiValue: (base) => ({
              ...base,
              minWidth: 'auto',
            }),
            multiValueRemove: () => ({}),
            valueContainer: (base) => ({
              ...base,
              flexWrap: 'nowrap',
              overflow: 'auto',
            }),
            control: () => ({
              width: '100%',
              background: 'white',
              fontFamily: 'Varela Round',
              fontSize: '14px',
              border: '2px solid black',
              height: '44px',
              display: 'flex',
              borderRadius: '5px',
              marginBottom: 0,
            }),
          }}
          options={groupedOptions}
          disableSearch={true}
          onChange={onSelectChange}
          hasSelectAll
          hideSelectedOptions={false}
          isSearchable={false}
          closeMenuOnSelect={false}
          formatOptionLabel={optionsRender}
          placeholder="Select filters"
        />
      </Box>
    )
  }
}

export { GroupingFilterDesktop }
