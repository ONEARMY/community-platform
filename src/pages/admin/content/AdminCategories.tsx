import * as React from 'react'
import { inject, observer } from 'mobx-react'
import type { CategoriesStore } from 'src/stores/Categories/categories.store'
import { Button, Modal } from 'oa-components'
import { Heading, Box, Text, Input, Flex } from 'theme-ui'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import type { ICategory } from 'src/models/categories.model'

// we include props from react-final-form fields so it can be used as a custom field component
interface IProps {
  categoriesStore: CategoriesStore
}
interface IState {
  updating?: boolean
  msg?: string
  categoryForm: Partial<ICategory>
  showEditor?: boolean
}

@inject('categoriesStore')
@observer
export class AdminCategories extends React.Component<IProps, IState> {
  saveEditor = async () => {
    this.setState({ updating: true })
    await this.props.categoriesStore.saveCategory(this.state.categoryForm)
    this.setState({ updating: false, showEditor: false })
  }
  deleteEditor = async () => {
    this.setState({ updating: true })
    await this.props.categoriesStore.deleteCategory(this.state.categoryForm)
    this.setState({ updating: false, showEditor: false })
  }
  showEditor = (category: Partial<ICategory>) => {
    this.setState({
      showEditor: true,
      categoryForm: { ...category },
    })
  }
  handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const patch = { [e.target.name]: e.target.value }
    this.setState({
      categoryForm: { ...this.state.categoryForm, ...patch },
    })
  }
  constructor(props: IProps) {
    super(props)
    this.state = { categoryForm: {} }
  }

  public render() {
    const { allCategories } = this.props.categoriesStore!
    const { categoryForm, showEditor, updating, msg } = this.state

    return (
      <Box mt={4}>
        <Flex>
          <Heading variant="small" sx={{ flex: 1 }}>
            Categories Admin
          </Heading>
          <Button onClick={() => this.showEditor(NEW_CATEGORY)}>
            Add Category
          </Button>
        </Flex>

        <Box my={3} bg={'white'} p={2}>
          <ReactTable
            data={allCategories}
            columns={CATEGORY_TABLE_COLUMNS}
            className="-highlight"
            defaultPageSize={Math.min(allCategories.length, 20)}
            showPageSizeOptions={false}
            getTdProps={(state, rowInfo) => {
              return {
                onClick: () => {
                  this.showEditor(rowInfo.original)
                },
              }
            }}
          />
        </Box>

        <Modal isOpen={!!showEditor}>
          <Box mb={3} bg={'white'} p={2}>
            {categoryForm._id && <Text>_id: {categoryForm._id}</Text>}
            <Input
              type="text"
              name="label"
              placeholder="Label"
              value={categoryForm.label}
              onChange={this.handleFormChange}
            />
            {msg && <Text color="red">{msg}</Text>}
            <Flex mt={3}>
              <Button
                mr={2}
                onClick={() => this.setState({ showEditor: false })}
                variant={'secondary'}
              >
                Cancel
              </Button>
              <Button
                onClick={this.saveEditor}
                disabled={!categoryForm.label || updating}
              >
                Save
              </Button>
              {categoryForm._id && (
                <Button onClick={this.deleteEditor} disabled={updating}>
                  Delete
                </Button>
              )}
            </Flex>
          </Box>
        </Modal>
      </Box>
    )
  }
}

const CATEGORY_TABLE_COLUMNS: { [key: string]: keyof ICategory }[] = [
  {
    Header: '_id',
    accessor: '_id',
  },
  {
    Header: 'label',
    accessor: 'label',
  },
]

const NEW_CATEGORY: Partial<ICategory> = {
  label: '',
}
