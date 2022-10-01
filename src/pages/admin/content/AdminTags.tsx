import * as React from 'react'
import { inject, observer } from 'mobx-react'
import type { TagsStore } from 'src/stores/Tags/tags.store'
import { Button, Modal, Select } from 'oa-components'
import { Heading, Box, Text, Input, Flex } from 'theme-ui'
import type { ITag, TagCategory } from 'src/models/tags.model'
// Import React Table
import ReactTable from 'react-table'
import 'react-table/react-table.css'

// we include props from react-final-form fields so it can be used as a custom field component
interface IProps {
  tagsStore?: TagsStore
}
interface IState {
  updating?: boolean
  msg?: string
  tagForm: Partial<ITag>
  showEditor?: boolean
}

@inject('tagsStore')
@observer
export class AdminTags extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = { tagForm: {} }
  }

  saveEditor = async () => {
    this.setState({ updating: true })
    await this.props.tagsStore!.saveTag(this.state.tagForm)
    this.setState({ updating: false, showEditor: false })
  }
  showEditor = (tag: Partial<ITag>) => {
    this.setState({
      showEditor: true,
      tagForm: { ...tag },
    })
  }

  handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const patch = { [e.target.name]: e.target.value }
    this.setState({
      tagForm: { ...this.state.tagForm, ...patch },
    })
  }

  onSelectedTagsChanged(values: ITagCategorySelect[]) {
    this.setState({
      tagForm: {
        ...this.state.tagForm,
        categories: values.map((v) => v.value),
      },
    })
  }

  public render() {
    const { allTags } = this.props.tagsStore!
    const { tagForm, showEditor, updating, msg } = this.state

    return (
      <Box mt={4}>
        <Flex>
          <Heading variant="small" sx={{ flex: 1 }}>
            Tags Admin
          </Heading>
          <Button onClick={() => this.showEditor(NEW_TAG)}>Add Tag</Button>
        </Flex>

        <Box my={3} bg={'white'} p={2}>
          <ReactTable
            data={allTags}
            columns={TAG_TABLE_COLUMNS}
            className="-highlight"
            defaultPageSize={Math.min(allTags.length, 20)}
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
            {tagForm._id && <Text>_id: {tagForm._id}</Text>}
            <Input
              type="text"
              name="label"
              placeholder="Label"
              value={tagForm.label}
              onChange={this.handleFormChange}
            />
            <Select
              isMulti
              options={TAG_CATEGORIES}
              value={this._getSelected()}
              onChange={(values) => this.onSelectedTagsChanged(values as any)}
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
                  !tagForm.label || tagForm.categories!.length === 0 || updating
                }
              >
                Save
              </Button>
            </Flex>
          </Box>
        </Modal>
      </Box>
    )
  }

  private _getSelected() {
    const selected = this.state.tagForm.categories
      ? this.state.tagForm.categories
      : []
    return TAG_CATEGORIES.filter((tag) => selected.includes(tag.value))
  }
}

const TAG_TABLE_COLUMNS: { [key: string]: keyof ITag }[] = [
  {
    Header: '_id',
    accessor: '_id',
  },
  {
    Header: 'label',
    accessor: 'label',
  },
  {
    Header: 'categories',
    accessor: 'categories',
  },
]
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
const NEW_TAG: Partial<ITag> = {
  label: '',
  categories: [],
}
interface ITagCategorySelect {
  label: string
  value: TagCategory
}
