import * as React from 'react'
import { inject, observer } from 'mobx-react'
import type { CategoriesStore } from 'src/stores/Categories/categories.store'
import type { ResearchCategoriesStore } from 'src/stores/ResearchCategories/researchCategories.store'
import { Button, Modal } from 'oa-components'
import { Heading, Box, Text, Input, Flex } from 'theme-ui'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import type { ICategory } from 'src/models/categories.model'
import type { IResearchCategory } from 'src/models/researchCategories.model'

// we include props from react-final-form fields so it can be used as a custom field component
interface IProps {
  categoriesStore: CategoriesStore
  researchCategoriesStore: ResearchCategoriesStore
}
interface IState {
  updating?: boolean
  msg?: string
  categoryForm: Partial<ICategory | IResearchCategory>
  showEditor?: boolean
  // The type of category being added or edited
  type: string
}

@inject('categoriesStore', 'researchCategoriesStore')
@observer
export class AdminCategories extends React.Component<IProps, IState> {
  saveEditor = async () => {
    this.setState({ updating: true })
    // Check the type of category and update the appropriate store
    if (this.state.type === 'how-to-category') {
      await this.props.categoriesStore.saveCategory(this.state.categoryForm)
    } else if (this.state.type === 'research-category') {
      await this.props.researchCategoriesStore.saveResearchCategory(
        this.state.categoryForm,
      )
    }
    this.setState({
      updating: false,
      msg: '',
      categoryForm: {
        label: '',
      },
      showEditor: false,
      type: '',
    })
  }
  deleteEditor = async () => {
    this.setState({ updating: true })
    // Check the type of category and update the appropriate store
    if (this.state.type === 'how-to-category') {
      await this.props.categoriesStore.deleteCategory(this.state.categoryForm)
    } else if (this.state.type === 'research-category') {
      await this.props.researchCategoriesStore.deleteResearchCategory(
        this.state.categoryForm,
      )
    }
    this.setState({
      updating: false,
      msg: '',
      categoryForm: {
        label: '',
      },
      showEditor: false,
      type: '',
    })
  }
  showEditor = (
    category: Partial<ICategory | IResearchCategory>,
    type: string,
  ) => {
    this.setState({
      showEditor: true,
      categoryForm: { ...category },
      type,
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
    this.state = {
      updating: false,
      msg: '',
      categoryForm: {
        label: '',
      },
      showEditor: false,
      type: '',
    }
  }

  render() {
    const { allCategories } = this.props.categoriesStore!
    const { allResearchCategories } = this.props.researchCategoriesStore!
    const { categoryForm, showEditor, updating, msg } = this.state

    return (
      <Box mt={4}>
        <Flex>
          <Heading variant="small" sx={{ flex: 1 }}>
            Categories Admin
          </Heading>
        </Flex>

        <Box mb={8}>
          <Flex mt={4} sx={{ alignItems: 'end' }}>
            <Text sx={{ flex: '1' }}>How to's</Text>
            <Button
              onClick={() => this.showEditor(NEW_CATEGORY, 'how-to-category')}
            >
              Add How-to Category
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
                    this.showEditor(rowInfo.original, 'how-to-category')
                  },
                }
              }}
            />
          </Box>
        </Box>

        <Box>
          <Flex mt={4} sx={{ alignItems: 'end' }}>
            <Text sx={{ flex: '1' }}>Research</Text>
            <Button
              onClick={() => this.showEditor(NEW_CATEGORY, 'research-category')}
            >
              Add Research Category
            </Button>
          </Flex>
          <Box my={3} bg={'white'} p={2}>
            <ReactTable
              data={allResearchCategories}
              columns={CATEGORY_TABLE_COLUMNS}
              className="-highlight"
              defaultPageSize={Math.min(allResearchCategories.length, 20)}
              showPageSizeOptions={false}
              getTdProps={(state, rowInfo) => {
                return {
                  onClick: () => {
                    this.showEditor(rowInfo.original, 'research-category')
                  },
                }
              }}
            />
          </Box>
        </Box>

        <Modal isOpen={!!showEditor}>
          <Box mb={3} bg={'white'} p={2}>
            {categoryForm._id && <Text>_id: {categoryForm._id}</Text>}
            <Input
              type="text"
              name="label"
              placeholder="Label"
              value={categoryForm.label}
              onChange={(e) => this.handleFormChange(e)}
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
