import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { TagsStore } from 'src/stores/Tags/tags.store'
import { ISelectedTags, ITag, TagCategory } from 'src/models/tags.model'
import { FieldRenderProps } from 'react-final-form'
import Select from 'react-select'
import { SelectStyles } from '../Form/Select.field'
import { FieldContainer } from '../Form/elements'

// we include props from react-final-form fields so it can be used as a custom field component
interface IProps extends FieldRenderProps<any, any> {
  value?: ISelectedTags
  onChange: (val: ISelectedTags) => void
  category: TagCategory | undefined
}
interface IState {
  selectedTags: string[]
}
interface InjectedProps extends IProps {
  tagsStore: TagsStore
}

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
  public componentWillMount() {
    if (this.props.value) {
      this.setState({
        selectedTags: this._selectedJsonToTagsArray(this.props.value),
      })
    }
    if (this.props.input.value) {
      this.setState({
        selectedTags: this._selectedJsonToTagsArray(this.props.input.value),
      })
    }
    this.injectedProps.tagsStore.setTagsCategory(this.props.category)
  }

  // emit values as {[tagKey]:true} object to be picked up by field
  public onSelectedTagsChanged(selected: ITag[]) {
    const selectedIDs = selected.map(tag => tag._id)
    this.props.onChange(this._tagsArrayToSelectedJson(selectedIDs))
  }

  public render() {
    const { categoryTags } = this.injectedProps.tagsStore
    return (
      <FieldContainer>
        <Select
          styles={SelectStyles}
          isMulti
          options={categoryTags}
          getOptionLabel={(tag: ITag) => tag.label}
          getOptionValue={(tag: ITag) => tag._id}
          onChange={values => this.onSelectedTagsChanged(values as ITag[])}
          placeholder="Select tags - 4 maximum"
        />
      </FieldContainer>
    )
  }

  // whilst we deal with arrays of selected tag ids in the component we want to store as a json map
  // to make it easier for querying. The next 2 functions handle conversion between formats
  // i.e [tag1,tag2,tag3] <-> {tag1:true, tag2:true, tag3:true}
  private _tagsArrayToSelectedJson(arr: string[]) {
    const selectedJson = {}
    arr.forEach(el => (selectedJson[el] = true))
    return selectedJson
  }
  private _selectedJsonToTagsArray(json: ISelectedTags) {
    return Object.keys(json)
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
}
