import { Component } from 'react';
import MultiSelect from '@khanacademy/react-multi-select'
import './GroupingFilter.css'
import ElWithBeforeIcon from 'src/components/ElWithBeforeIcon'
import { IMapGrouping } from 'src/models/maps.models'
import { inject } from 'mobx-react'
import { MapsStore } from 'src/stores/Maps/maps.store'
import { Box } from 'rebass/styled-components'

interface IProps {
  items: Array<IMapGrouping>
  entityType: string
  onChange?: (selectedItems: string[]) => void
}

interface IState {
  initialItems: Array<any>
  selectedItems: Array<string>
}
interface IInjectedProps extends IProps {
  mapsStore: MapsStore
}

const ItemRenderer = ({ checked, option, onClick }) => {
  return (
    <div
      onClick={evt => {
        evt.preventDefault()
        evt.stopPropagation()
        onClick(option.value)
      }}
    >
      <ElWithBeforeIcon
        IconUrl={option.icon}
        ticked={checked}
        contain={true}
        width="20px"
        height="20px"
      >
        <h4
          style={{
            fontSize: '14px',
            lineHeight: '24px',
            margin: '0 0 0 10px',
            paddingTop: '2px',
            paddingBottom: '2px',
          }}
        >
          {option.label} ({option.number})
        </h4>
      </ElWithBeforeIcon>
    </div>
  )
}
@inject('mapsStore')
class GroupingFilterDesktop extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      initialItems: this.asOptions(props.items),
      selectedItems: [],
    }
  }
  get injected() {
    return this.props as IInjectedProps
  }

  handleChange(selectedItems: Array<string>) {
    this.setState({ selectedItems })
    if (this.props.onChange) {
      this.props.onChange(selectedItems)
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
        // add split(' ') method to convert to array
        number: this.injected.mapsStore.getPinsNumberByFilterType(
          item.subType ? item.subType.split(' ') : item.type.split(' '),
        ),
      }))
  }

  render() {
    const { items, entityType } = this.props
    const options = this.asOptions(items)
    const selectedItems = this.state.selectedItems
    return (
      <Box width="300px" ml="5px" sx={{ display: ['none', 'block', 'block'] }}>
        <MultiSelect
          options={options}
          selected={selectedItems}
          selectAllLabel="Select All"
          disableSearch={true}
          onSelectedChanged={selected => this.handleChange(selected)}
          valueRenderer={values => {
            // controls label display, use default when values selected or title when none
            return values.length > 0
              ? null
              : entityType === 'place'
              ? 'All Workspaces'
              : 'Others'
          }}
          hasSelectAll={false}
          ItemRenderer={ItemRenderer}
        />
      </Box>
    )
  }
}

export { GroupingFilterDesktop }
