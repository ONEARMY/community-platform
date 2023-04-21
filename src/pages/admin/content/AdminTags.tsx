import * as React from 'react'
import { inject, observer } from 'mobx-react'
import type { TagsStore } from 'src/stores/Tags/tags.store'
import { Button, Modal } from 'oa-components'
import { Heading, Box, Input, Select, Flex, Label, Text } from 'theme-ui'
import type { ITag, TagCategory } from 'src/models/tags.model'
// Import React Table
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import type { Column } from 'react-table'
import { Form, Field } from 'react-final-form'

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

type TagFormErrors = {
  label?: string
  categories?: string
}

const validate = (values) => {
  const errors: TagFormErrors = {}
  if (!values.label) {
    errors.label = 'Please provide non empty label'
  }
  if (!values.categories || values.categories.length === 0) {
    errors.categories = 'Please provide at least one category'
  }
  return errors
}

const TagForm = ({ onSubmit, tagForm, updating, hideModal }) => {
  return (
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
                <Input {...input} type="text" placeholder="Label" id="label" />
                {meta.error && meta.touched && (
                  <Text sx={{ color: 'red' }}>{meta.error}</Text>
                )}
              </Box>
            )}
          </Field>
          <Field name="categories" type="select">
            {({ input, meta }) => (
              <Box>
                <Label htmlFor="categories">Label name:</Label>
                <Select multiple id="categories" {...input} autoFocus>
                  {TAG_CATEGORIES.map((cur) => (
                    <option key={cur.value} label={cur.label}>
                      {cur.value}
                    </option>
                  ))}
                </Select>
                {meta.error && meta.touched && (
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
  )
}
@inject('tagsStore')
@observer
export class AdminTags extends React.Component<IProps, IState> {
  saveEditor = async (values) => {
    this.setState({ updating: true })
    await this.props.tagsStore!.saveTag(values)
    this.setState({ updating: false, showEditor: false })
  }
  showEditor = (tag: Partial<ITag>) => {
    this.setState({
      showEditor: true,
      tagForm: { ...tag },
    })
  }
  constructor(props: IProps) {
    super(props)
    this.state = { tagForm: {} }
  }

  public render() {
    const { allTags } = this.props.tagsStore!
    const { tagForm, showEditor, updating } = this.state

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
          <TagForm
            tagForm={tagForm}
            updating={updating}
            onSubmit={(values) => this.saveEditor(values)}
            hideModal={() => this.setState({ showEditor: false })}
          />
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

const TAG_TABLE_COLUMNS: Array<Column<ITag>> = [
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
    id: 'categories',
    accessor: (tag: ITag) => tag.categories.join(', '),
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
