import * as React from 'react'
import { ITag } from 'src/models/models'
import { inject, observer } from 'mobx-react'
import { TagsStore } from 'src/stores/Tags/tags.store'
import { Button } from '@material-ui/core'
import './TagsSelect.scss'
import { ISelectedTags } from 'src/models/tags.model'

interface IProps {
  value?: ISelectedTags
  onChange: (val: ISelectedTags) => void
}
interface IState {
  selectedTags: string[]
  allTags: ITag[]
}
interface InjectedProps extends IProps {
  tagsStore: TagsStore
}
@inject('tagsStore')
@observer
export class TagsSelect extends React.Component<IProps, IState> {
  public static defaultProps: IProps
  constructor(props: any) {
    super(props)
    this.state = { selectedTags: [], allTags: [] }
  }
  get injectedProps() {
    return this.props as InjectedProps
  }

  // if we initialise with a value we want to update the state to reflect the selected tags
  public componentWillMount() {
    if (this.props.value) {
      this.setState({
        selectedTags: this._selectedJsonToTagsArray(this.props.value),
      })
    }
  }

  public onTagClick(tagKey: string) {
    const selected = this.state.selectedTags
    const isSelectedIndex = selected.indexOf(tagKey)
    isSelectedIndex > -1
      ? selected.splice(isSelectedIndex, 1)
      : selected.push(tagKey)
    this.setState({ selectedTags: selected })
    // trigger onChange callback to update parent
    this.props.onChange(this._tagsArrayToSelectedJson(selected))
  }

  public render() {
    const { tags } = this.injectedProps.tagsStore
    const { selectedTags } = this.state
    return (
      <div className="tags-container">
        {tags.map(tag => (
          // use keys to help react understand when a tab has changed
          <div key={tag._key} className="tag__container">
            <Button
              onClick={() => this.onTagClick(tag._key)}
              variant="outlined"
              className={
                selectedTags.indexOf(tag._key) > -1
                  ? 'tag__button tag__button--selected'
                  : 'tag__button'
              }
            >
              {tag.label}
            </Button>
          </div>
        ))}
      </div>
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

// default function will be called if no onChange method supplied
TagsSelect.defaultProps = {
  onChange: val => {
    return
  },
  value: {},
}

// public sortTagsIntoCategories(tags: ITag[]) {
// this is where the method will go to sort tags via their category field
// so that we can use multiple tags with the same label
// (e.g. 'compression' as machine and 'compression' as process)
// }

/*  As the tag store has a method to automatically populate tags on construction we don't need to 
      explictly call the subscription initialisation function, code remaining just as example of how we could
  */
// public componentDidMount() {
//   this.injectedProps.tagsStore.subscribeToTags()
// }
