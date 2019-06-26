import React, { Component } from 'react'
import styled from 'styled-components'
import MultiSelect from '@khanacademy/react-multi-select'
import './FilterSelect.css'

interface IProps {
  items: Array<any>
  entityType: string
  onChange?: (selectedItems) => void
}

interface IState {
  selectedItems: Array<string>
  open: boolean
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
    <span>
      <input
        type="checkbox"
        onChange={onClick}
        checked={checked}
        tabIndex={-1}
      />
      <ItemCounter grouping={option.value.grouping}>9</ItemCounter>
      <ItemLabel>{option.label}</ItemLabel>
    </span>
  )
}

class FilterSelect extends React.Component<IProps, IState> {
  constructor(props) {
    super(props)
    this.state = {
      selectedItems: [],
      open: true,
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(selectedItems) {
    console.log(selectedItems)
    if (this.props.onChange) {
      this.props.onChange(selectedItems)
    }
    this.setState({ selectedItems })
  }

  render() {
    const { selectedItems } = this.state
    const { items, entityType } = this.props
    const options = items.map(item => ({
      label: item.displayName,
      value: item,
    }))
    return (
      <MultiSelect
        options={options}
        selected={selectedItems}
        selectAllLabel="Select All"
        disableSearch={true}
        onSelectedChanged={this.handleChange}
        valueRenderer={() =>
          entityType === 'place' ? 'Workplaces' : 'Members'
        }
        hasSelectAll={false}
        ItemRenderer={ItemRenderer}
        style={{
          maxWidth: '250px',
          width: '100%',
        }}
      />
    )
  }
}

export { FilterSelect }
