import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { useState } from 'react'
import { Select } from './Select'

export default {
  title: 'Components/Select',
  component: Select,
} as ComponentMeta<typeof Select>

export const Default: ComponentStory<typeof Select> = () => {
  return (
    <Select
      value={''}
      placeholder="A placeholder value"
      options={[
        {
          value: 'value-one',
          label: 'Value 1',
        },
        {
          value: 'value-two',
          label: 'Value 2',
        },
      ]}
    />
  )
}

export const Clearable: ComponentStory<typeof Select> = () => {
  const [value, setValue] = useState()
  return (
    <Select
      value={value}
      onChange={setValue}
      placeholder="A placeholder value"
      isClearable={true}
      options={[
        {
          value: 'value-one',
          label: 'Value 1',
        },
        {
          value: 'value-two',
          label: 'Value 2',
        },
      ]}
    />
  )
}

export const MultipleSelect: ComponentStory<typeof Select> = () => {
  const [value, setValue] = useState()
  return (
    <Select
      value={value}
      onChange={setValue}
      isMulti={true}
      placeholder="A placeholder value"
      options={[
        {
          value: 'value-one',
          label: 'Value 1',
        },
        {
          value: 'value-two',
          label: 'Value 2',
        },
      ]}
    />
  )
}

export const FormSelect: ComponentStory<typeof Select> = () => {
  const [value, setValue] = useState()
  return (
    <Select
      variant="form"
      value={value}
      onChange={setValue}
      isMulti={true}
      placeholder="A placeholder value"
      options={[
        {
          value: 'value-one',
          label: 'Value 1',
        },
        {
          value: 'value-two',
          label: 'Value 2',
        },
      ]}
    />
  )
}

export const SelectWithIcons: ComponentStory<typeof Select> = () => {
  const [value, setValue] = useState()
  return (
    <Select
      variant="icons"
      value={value}
      onChange={setValue}
      isMulti={true}
      placeholder="A placeholder value"
      options={[
        {
          label: '',
          options: [
            {
              imageElement: '',
              value: 'verified',
              label: 'Verified',
            },
          ],
        },
        {
          label: 'All Workspaces',
          options: [
            {
              imageElement: '',
              value: 'verified',
              label: 'Verified',
            },
          ],
        },
        {
          label: 'Others',
          options: [
            {
              imageElement: '',
              value: 'verified',
              label: 'Verified',
            },
          ],
        },
      ]}
    />
  )
}
