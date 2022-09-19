import { Component } from 'react'
import { inject, observer } from 'mobx-react'
import type { TagsStore } from 'src/stores/Tags/tags.store'
import type { ISelectedTags, ITag, TagCategory } from 'src/models/tags.model'
import type { FieldRenderProps } from 'react-final-form'
import { Select } from 'oa-components'
import { FieldContainer } from '../Form/FieldContainer'

// we include props from react-final-form fields so it can be used as a custom field component
export interface IProps extends Partial<FieldRenderProps<any, any>> {
  value?: ISelectedTags
  onChange: (val: ISelectedTags) => void
  category?: TagCategory | undefined
  styleVariant?: 'selector' | 'filter'
  placeholder?: string
  relevantTagsItems?: ICollectionWithTags[]
}
interface IState {
  selectedTags: string[]
}
interface InjectedProps extends IProps {
  tagsStore: TagsStore
}

interface ICollectionWithTags {
  tags?: ISelectedTags
}

@inject('tagsStore')
@observer
class TagsSelect extends Component<IProps, IState> {
  public static defaultProps: IProps
  constructor(props: any) {
    super(props)
    this.state = { selectedTags: [] }
  }
  get injectedProps() {
    return this.props as InjectedProps
  }

  // if we initialise with a value we want to update the state to reflect the selected tags
  // we repeat this additionally for input in case it is being used as input component for react-final-form field
  public componentDidMount() {
    const propsVal = { ...this.props.value, ...this.props.input!.value }
    const selectedTags = Object.keys(propsVal)
    this.setState({ selectedTags })
    this.props.onChange(propsVal)
    this.injectedProps.tagsStore.setTagsCategory(this.props.category)
  }

  // emit values as {[tagKey]:true} object to be picked up by field
  public onSelectedTagsChanged(selected: ITag[]) {
    const selectedTags = selected.map((tag) => tag._id)
    this.setState({ selectedTags })
    this.props.onChange(this._tagsArrayToSelectedJson(selectedTags))
  }

  public render() {
    let { categoryTags } = this.injectedProps.tagsStore
    const relevantTagsItems = this.injectedProps.relevantTagsItems

    if (relevantTagsItems) {
      const tagCounts = this._getTagCounts(relevantTagsItems)
      categoryTags = categoryTags.filter((tag) =>
        Object.keys(tagCounts).includes(tag._id),
      )
    }

    return (
      <FieldContainer
        // provide a data attribute that can be used to see if tags populated
        data-cy={categoryTags?.length > 0 ? 'tag-select' : 'tag-select-empty'}
      >
        <Select
          options={categoryTags}
          placeholder={this.props.placeholder}
          isMulti={true}
          value={this._getSelected(categoryTags)}
          getOptionLabel={(tag: ITag) => tag.label}
          getOptionValue={(tag: ITag) => tag._id}
          onChange={(values) => this.onSelectedTagsChanged(values as ITag[])}
        />
      </FieldContainer>
    )
  }

  // as react-select can't keep track of which object key corresponds to the selected
  // value include manual lookup so that value can also be passed from props
  private _getSelected(categoryTags: ITag[]) {
    return categoryTags?.filter((tag) =>
      this.state.selectedTags.includes(tag._id),
    )
  }

  // whilst we deal with arrays of selected tag ids in the component we want to store as a json map
  // to make it easier for querying. The next 2 functions handle conversion between formats
  // i.e [tag1,tag2,tag3] <-> {tag1:true, tag2:true, tag3:true}
  private _tagsArrayToSelectedJson(arr: string[]) {
    const selectedJson = {}
    arr.forEach((el) => (selectedJson[el] = true))
    return selectedJson
  }

  // we want to display only those tags that return results, meaning they are used by how-tos, events, etc
  private _getTagCounts(items: ICollectionWithTags[]) {
    const tagCounts: { [key: string]: number } = {}

    items.map(
      (item) =>
        item.tags &&
        Object.keys(item.tags).forEach(
          (tag) => (tagCounts[tag] = (tagCounts[tag] || 0) + 1),
        ),
    )

    return tagCounts
  }
}

// use default (non-named) export to save accidentally importing instead of styled component
export default TagsSelect

// default function will be called if no onChange method supplied
// include default input and meta bindings for use within form fields
// default onChange calls the input onChange function (linked to react-final-form)
TagsSelect.defaultProps = {
  onChange: (val) => {
    TagsSelect.defaultProps.input!.onChange(val)
  },
  input: {
    name: 'tagsSelect',
    onBlur: () => null,
    onChange: () => null,
    onFocus: () => null,
    value: {},
  },
  meta: {},
  value: {},
  category: undefined,
  styleVariant: 'selector',
  placeholder: 'Select tags (max 4)',
}
