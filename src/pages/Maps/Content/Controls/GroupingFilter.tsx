import React, { Component } from 'react'
import styled from 'styled-components'
import MultiSelect, { Option } from '@khanacademy/react-multi-select'
import './GroupingFilter.css'
import ElWithBeforeIcon from 'src/components/ElWithBeforeIcon'
import { IMapGrouping } from 'src/models/maps.models'

interface IProps {
  items: Array<IMapGrouping>
  entityType: string
  onChange?: (selectedItems: string[]) => void
}

interface IState {
  initialItems: Array<any>
  selectedItems: Array<string>
}

const ItemLabel = styled.span`
  display: inline-block;
  vertical-align: middle;
  cursor: default;
  padding: 2px 8px;
`

interface ItemCounterProps {
  grouping: string
}

const ItemCounter = styled.span<ItemCounterProps>`
  border-radius: ${p => (p.grouping === 'individual' ? '50%' : '0%')};
  background-color: ${p =>
    p.grouping === 'individual' ? '#6666FF' : '#FF6666'};
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
  line-height: 20px;
  font-size: 0.65rem;
  text-align: center;
  color: white;
  margin-left: 5px;
`

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
        width="30px"
        height="30px"
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
          {option.label}
        </h4>
      </ElWithBeforeIcon>
    </div>
  )
}

class GroupingFilter extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      initialItems: this.asOptions(props.items),
      selectedItems: [],
    }
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
      }))
  }

  render() {
    const { items, entityType } = this.props
    const options = this.asOptions(items)
    const selectedItems = this.state.selectedItems
    return (
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
            ? 'Workspaces'
            : 'Others'
        }}
        hasSelectAll={false}
        ItemRenderer={ItemRenderer}
        style={{
          maxWidth: '200px',
          width: '100%',
          margin: '5px 0',
        }}
      />
    )
  }
}

export { GroupingFilter }
