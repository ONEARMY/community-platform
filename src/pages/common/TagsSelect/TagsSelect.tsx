import * as React from 'react'
import { ITag } from 'src/models/models'
import { inject, observer } from 'mobx-react'
import { TagsStore } from 'src/stores/Tags/tags.store'
import { Button } from '@material-ui/core'
import './TagsSelect.scss'

interface IProps {
  value?: string[]
  onChange: (val: string[]) => void
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

  // if we pass a value to the component we want to update the state to reflect the selected tags
  public componentWillReceiveProps(nextProps: IProps) {
    this.setState({ selectedTags: nextProps.value ? nextProps.value : [] })
    console.log('props updated', this.state)
  }

  public onTagClick(tagKey: string) {
    const selected = this.state.selectedTags
    const isSelectedIndex = selected.indexOf(tagKey)
    isSelectedIndex > -1
      ? selected.splice(isSelectedIndex, 1)
      : selected.push(tagKey)
    this.setState({ selectedTags: selected })
    console.log('selected tags', this.state.selectedTags)
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
}

TagsSelect.defaultProps = {
  onChange: val => {
    console.log('default change function')
    return
  },
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
