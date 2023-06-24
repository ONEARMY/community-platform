import { useState } from 'react'

import { observer } from 'mobx-react'
import { useCommonStores } from 'src/index'
import Table from '../components/Table/Table'
import type { ITableProps } from '../components/Table/Table'
import type { ITag, TagCategory } from 'src/models'
import { Button, Modal } from 'oa-components'
import { Heading, Box, Input, Select, Flex, Label, Text } from 'theme-ui'
import { Form, Field } from 'react-final-form'

type TagFormErrors = {
  label?: string
  categories?: string
}

const TABLE_COLUMNS: ITableProps<ITag>['columns'] = [
  {
    Header: 'ID',
    accessor: '_id',
  },
  {
    Header: 'Label',
    accessor: 'label',
  },
  {
    Header: 'Category',
    accessor: 'categories',
  },
]

interface ITagCategorySelect {
  label: string
  value: TagCategory
}

// TODO - currently all hard-coded, would be good to allow custom categories and organisation
const TAG_CATEGORIES: ITagCategorySelect[] = [
  {
    label: 'how-to',
    value: 'how-to',
  },
  {
    label: 'event',
    value: 'event',
  },
]

export const ERRORS = {
  label: 'Please provide non empty label',
  categories: 'Please provide at least one category',
}

const validate = (values) => {
  const errors: TagFormErrors = {}
  if (!values.label) {
    errors.label = ERRORS.label
  }
  if (!values.categories || values.categories.length === 0) {
    errors.categories = ERRORS.categories
  }

  return errors
}

const TagForm = ({ onSubmit, tagForm, updating, hideModal }) => {
  return (
    <div data-testid="tag-form">
      <Form
        onSubmit={onSubmit}
        validate={validate}
        initialValues={{
          _id: tagForm._id,
          label: tagForm.label,
          categories: tagForm.categories ?? [],
        }}
        render={({ handleSubmit, pristine }) => (
          <Box mb={3} bg="white" p={2} as="form" onSubmit={handleSubmit}>
            {tagForm._id && <Label>_id: {tagForm._id}</Label>}
            <Field name="label">
              {({ input, meta }) => (
                <Box>
                  <Label htmlFor="label">Label name:</Label>
                  <Input
                    {...input}
                    type="text"
                    placeholder="Label"
                    id="label"
                  />
                  {meta.error && meta.dirty && (
                    <Text sx={{ color: 'red' }}>{meta.error}</Text>
                  )}
                </Box>
              )}
            </Field>
            <Field name="categories" type="select">
              {({ input, meta }) => (
                <Box>
                  <Label htmlFor="categories">Categories:</Label>
                  <Select multiple id="categories" {...input} autoFocus>
                    {TAG_CATEGORIES.map((cur) => (
                      <option key={cur.value} label={cur.label}>
                        {cur.value}
                      </option>
                    ))}
                  </Select>
                  {meta.error && meta.dirty && (
                    <Text sx={{ color: 'red' }}>{meta.error}</Text>
                  )}
                </Box>
              )}
            </Field>
            <Flex mt={3}>
              <Button mr={2} onClick={hideModal} variant={'secondary'}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={pristine || updating}>
                Save
              </Button>
            </Flex>
          </Box>
        )}
      />
    </div>
  )
}

const TagCell = ({ col, onClick }) => {
  const { field, value, rowInfo } = col
  const row = rowInfo?.row || {}

  return (
    <div
      style={{ cursor: 'pointer' }}
      onClick={() => onClick(row)}
      data-testid={`${row._id}-${field}`}
    >
      {value}
    </div>
  )
}

const AdminTags = observer(() => {
  const {
    stores: { tagsStore },
  } = useCommonStores()
  const [{ updating, showEditor, tag }, setFormData] = useState({
    updating: false,
    showEditor: false,
    tag: {},
  })

  const toggleForm = (tag = {}) =>
    setFormData({ updating, showEditor: !showEditor, tag })

  const saveEditor = async (values) => {
    setFormData((current) => ({ ...current, updating: true }))
    await tagsStore!.saveTag(values)
    setFormData((current) => ({
      ...current,
      updating: false,
      showEditor: false,
    }))
  }

  return (
    <>
      <Flex sx={{ alignItems: 'center', mt: 5 }}>
        <Heading variant="small" sx={{ flex: 1 }}>
          Tags Admin
        </Heading>
        <Button onClick={() => toggleForm({ label: '', categories: [] })}>
          Add Tag
        </Button>
      </Flex>

      <Modal isOpen={showEditor}>
        <TagForm
          tagForm={tag}
          updating={updating}
          onSubmit={saveEditor}
          hideModal={toggleForm}
        />
      </Modal>

      <Table
        data={tagsStore.allTags}
        columns={TABLE_COLUMNS}
        rowComponent={(props) => (
          <TagCell {...{ ...props, onClick: toggleForm }} />
        )}
      />
    </>
  )
})
export default AdminTags
