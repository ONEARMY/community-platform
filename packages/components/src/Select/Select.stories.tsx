import type { StoryFn, Meta } from '@storybook/react'
import { useState } from 'react'
import { Select } from './Select'

export default {
  title: 'Components/Select',
  component: Select,
} as Meta<typeof Select>

export const Default: StoryFn<typeof Select> = () => {
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

export const Clearable: StoryFn<typeof Select> = () => {
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

export const MultipleSelect: StoryFn<typeof Select> = () => {
  const [value, setValue] = useState([
    {
      value: 'value-three',
      label: 'Value 3',
    },
  ])

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
        {
          value: 'value-three',
          label: 'Value 3',
        },
      ]}
    />
  )
}

export const FormSelect: StoryFn<typeof Select> = () => {
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

export const SelectWithIcons: StoryFn<typeof Select> = () => {
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
