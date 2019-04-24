import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { TagsStore } from 'src/stores/Tags/tags.store'
import './TagDisplay.scss'
import { ITag } from 'src/models/tags.model'

/*
This component takes a tag key as an input, looks up the tag information from the global store
and renders the tag label.
*/
interface IProps {
  tagKey: string
}
interface IState {
  tag: ITag
}
interface InjectedProps extends IProps {
  tagsStore: TagsStore
}
@inject('tagsStore')
@observer
export class TagDisplay extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props)
  }
  get injectedProps() {
    return this.props as InjectedProps
  }

  public componentWillMount() {
    const activeTag = this.injectedProps.tagsStore.tagsByKey[this.props.tagKey]
    this.setState({ tag: activeTag })
  }

  public render() {
    const { tag } = this.state
    return tag ? (
      <div className="tag-display">
        <div className="tag__label">{tag.label}</div>
      </div>
    ) : null
  }
}
