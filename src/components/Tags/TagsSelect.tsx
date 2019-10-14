import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { TagsStore } from 'src/stores/Tags/tags.store'
import { ISelectedTags, ITag, TagCategory } from 'src/models/tags.model'
import { FieldRenderProps } from 'react-final-form'
import Select from 'react-select'
import { SelectStyles, FilterStyles } from '../Form/Select.field'
import { FieldContainer } from '../Form/elements'

// we include props from react-final-form fields so it can be used as a custom field component
export interface IProps extends FieldRenderProps<any, any> {
  value?: ISelectedTags
  onChange: (val: ISelectedTags) => void
  category: TagCategory | undefined
  styleVariant: 'selector' | 'filter'
  placeholder: string
  showOnlyRelevantTags?: any
}
interface IState {
  selectedTags: string[]
}
interface InjectedProps extends IProps {
  tagsStore: TagsStore
}

const filterArrayDuplicates = (array: string[]) => Array.from(new Set(array))

@inject('tagsStore')
@observer
class TagsSelect extends React.Component<IProps, IState> {
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
    const propsVal = { ...this.props.value, ...this.props.input.value }
    const selectedTags = Object.keys(propsVal)
    this.setState({ selectedTags })
    this.props.onChange(propsVal)
    this.injectedProps.tagsStore.setTagsCategory(this.props.category)
  }

  // emit values as {[tagKey]:true} object to be picked up by field
  public onSelectedTagsChanged(selected: ITag[]) {
    const selectedTags = selected.map(tag => tag._id)
    this.setState({ selectedTags })
    this.props.onChange(this._tagsArrayToSelectedJson(selectedTags))
  }

  public render() {
    let { categoryTags } = this.injectedProps.tagsStore
    const relevantTags = this.injectedProps.showOnlyRelevantTags

    if (relevantTags) {
      const result = this._filterRelevantTags(relevantTags)
      categoryTags = categoryTags.filter(tag => result.includes(tag._id))
    }

    const { styleVariant } = this.props
    return (
      <FieldContainer data-cy={'tag-select'}>
        <Select
          styles={styleVariant === 'selector' ? SelectStyles : FilterStyles}
          isMulti
          options={categoryTags}
          value={this._getSelected(categoryTags)}
          getOptionLabel={(tag: ITag) => tag.label}
          getOptionValue={(tag: ITag) => tag._id}
          onChange={values => this.onSelectedTagsChanged(values as ITag[])}
          placeholder={this.props.placeholder}
          classNamePrefix={'data-cy'}
        />
      </FieldContainer>
    )
  }

  // as react-select can't keep track of which object key corresponds to the selected
  // value include manual lookup so that value can also be passed from props
  private _getSelected(categoryTags: ITag[]) {
    return categoryTags.filter(tag => this.state.selectedTags.includes(tag._id))
  }

  // whilst we deal with arrays of selected tag ids in the component we want to store as a json map
  // to make it easier for querying. The next 2 functions handle conversion between formats
  // i.e [tag1,tag2,tag3] <-> {tag1:true, tag2:true, tag3:true}
  private _tagsArrayToSelectedJson(arr: string[]) {
    const selectedJson = {}
    arr.forEach(el => (selectedJson[el] = true))
    return selectedJson
  }

  // we want to display only those tags that return results, meaning they are used by how-tos, events, etc
  private _filterRelevantTags(items: any) {
    const usedTags: string[] = []

    items.map(
      item =>
        item.tags && Object.keys(item.tags).forEach(tag => usedTags.push(tag)),
    )
    const uniqueUsedTags = filterArrayDuplicates(usedTags)

    return uniqueUsedTags
  }
}

// use default (non-named) export to save accidentally importing instead of styled component
export default TagsSelect

// default function will be called if no onChange method supplied
// include default input and meta bindings for use within form fields
// default onChange calls the input onChange function (linked to react-final-form)
TagsSelect.defaultProps = {
  onChange: val => {
    TagsSelect.defaultProps.input.onChange(val)
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
  placeholder: 'Select tags - 4 maximum',
}
