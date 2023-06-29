import { useState } from 'react'
import { observer } from 'mobx-react'
import { Button, Modal } from 'oa-components'
import { Heading, Box, Text, Input, Flex, Label } from 'theme-ui'
import { Form, Field } from 'react-final-form'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import type { ICategory } from 'src/models/categories.model'
import type { IResearchCategory } from 'src/models/researchCategories.model'
import { useCommonStores } from 'src/index'

const CATEGORY_TABLE_COLUMNS: {
  [key: string]: keyof ICategory | IResearchCategory
}[] = [
  {
    Header: '_id',
    accessor: '_id',
  },
  {
    Header: 'label',
    accessor: 'label',
  },
]

const NEW_CATEGORY: Partial<ICategory | IResearchCategory> = {
  label: '',
}

const FORM_DATA_DEFAULTS = {
  type: '',
  categoryForm: {},
  showEditor: false,
  updating: false,
}

const CategoryTable = ({ label, type, categories, showEditor }) => {
  return (
    <Box mb={8}>
      <Flex mt={4} sx={{ alignItems: 'end' }}>
        <Text sx={{ flex: '1' }}>{label} Categories</Text>
        <Button onClick={() => showEditor(NEW_CATEGORY, type)}>
          Add {label} Category
        </Button>
      </Flex>
      <Box my={3} bg={'white'} p={2}>
        <ReactTable
          data={categories}
          columns={CATEGORY_TABLE_COLUMNS}
          className="-highlight"
          defaultPageSize={Math.min(categories.length, 20)}
          showPageSizeOptions={false}
          getTdProps={(_, rowInfo) => {
            return {
              onClick: () => showEditor(rowInfo.original, type),
            }
          }}
        />
      </Box>
    </Box>
  )
}

const CategoryForm = ({
  type,
  showEditor,
  categoryForm,
  saveEditor,
  deleteEditor,
  closeForm,
  updating,
}) => {
  return (
    <Modal isOpen={!!showEditor}>
      <Form
        onSubmit={saveEditor}
        initialValues={{
          _id: categoryForm._id,
          label: categoryForm.label,
        }}
        render={({ handleSubmit, pristine }) => (
          <Box
            mb={3}
            bg="white"
            p={2}
            as="form"
            onSubmit={handleSubmit}
            data-testid={`${type}-form`}
          >
            {categoryForm._id && <Label>_id: {categoryForm._id}</Label>}
            <Field name="label">
              {({ input }) => (
                <Box>
                  <Label htmlFor="label">Label name:</Label>
                  <Input
                    {...input}
                    type="text"
                    placeholder="Label"
                    id="label"
                  />
                </Box>
              )}
            </Field>
            <Flex mt={3}>
              <Button mr={2} onClick={closeForm} variant={'secondary'}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={pristine || updating}>
                Save
              </Button>
              {categoryForm._id && (
                <Button onClick={deleteEditor} disabled={updating}>
                  Delete
                </Button>
              )}
            </Flex>
          </Box>
        )}
      />
    </Modal>
  )
}

const AdminCategories = observer(() => {
  const {
    stores: { categoriesStore, researchCategoriesStore },
  } = useCommonStores()
  const [{ type, categoryForm, showEditor, updating }, setFormData] =
    useState(FORM_DATA_DEFAULTS)

  const openForm = (categoryForm = {}, type = '') =>
    setFormData((current) => ({
      ...current,
      categoryForm,
      type,
      showEditor: !showEditor,
    }))
  const closeForm = () => setFormData(FORM_DATA_DEFAULTS)
  const saveEditor = async (values) => {
    setFormData((current) => ({ ...current, updating: true }))

    if (type === 'how-to-category') await categoriesStore.saveCategory(values)
    if (type === 'research-category')
      await researchCategoriesStore.saveResearchCategory(values)

    closeForm()
  }
  const deleteEditor = async () => {
    setFormData((current) => ({ ...current, updating: true }))

    if (type === 'how-to-category')
      await categoriesStore.deleteCategory(categoryForm)
    if (type === 'research-category')
      await researchCategoriesStore.deleteResearchCategory(categoryForm)

    closeForm()
  }

  return (
    <Box mt={4}>
      <Flex>
        <Heading variant="small" sx={{ flex: 1 }}>
          Categories Admin
        </Heading>
      </Flex>

      <CategoryTable
        label="How-to"
        type="how-to-category"
        categories={categoriesStore.allCategories}
        showEditor={openForm}
      />
      <CategoryTable
        label="Research"
        type="research-category"
        categories={researchCategoriesStore.allResearchCategories}
        showEditor={openForm}
      />

      <CategoryForm
        {...{
          type,
          updating,
          categoryForm,
          showEditor,
          saveEditor,
          deleteEditor,
          closeForm,
        }}
      />
    </Box>
  )
})

export default AdminCategories
