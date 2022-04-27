import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { CategoriesStore } from 'src/stores/Categories/categories.store'
import { Button } from 'oa-components'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import { Box } from 'theme-ui'
import Flex from 'src/components/Flex'
import { Modal } from 'src/components/Modal/Modal'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { Input } from 'src/components/Form/elements'
import { ICategory } from 'src/models/categories.model'

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
  constructor(props: IProps) {
    super(props)
    this.state = { categoryForm: {} }
  }

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

  public render() {
    const { allCategories } = this.props.categoriesStore!
    const { categoryForm, showEditor, updating, msg } = this.state

    return (
      <Box mt={4}>
        <Flex>
          <Heading small sx={{ flex: 1 }}>
            Categories Admin
          </Heading>
          <Button onClick={() => this.showEditor(NEW_TAG)}>Add Category</Button>
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

        {showEditor && (
          <Modal>
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
                  disabled={
                    !categoryForm.label ||
                    updating
                  }
                >
                  Save
                </Button>
                {categoryForm._id &&
                  <Button
                    onClick={this.saveEditor}
                  >
                    Delete
                  </Button>
                }
              </Flex>
            </Box>
          </Modal>
        )}
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

const NEW_TAG: Partial<ICategory> = {
  label: '',
}
