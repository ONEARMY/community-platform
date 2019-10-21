import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { TagsStore } from 'src/stores/Tags/tags.store'
import Text from 'src/components/Text'
import Styled from 'styled-components'

/*
This component takes a tag key as an input, looks up the tag information from the global store
and renders the tag label.
*/
interface IProps {
  tagKey: string
}
interface InjectedProps extends IProps {
  tagsStore: TagsStore
}

const TagContainer = Styled(Text)`
	position: relative;
  margin-bottom: 4px;
`

@inject('tagsStore')
@observer
export default class TagDisplay extends React.Component<IProps> {
  constructor(props: any) {
    super(props)
  }
  get injectedProps() {
    return this.props as InjectedProps
  }

  public render() {
    const tag = this.injectedProps.tagsStore.allTagsByKey[this.props.tagKey]

    return tag ? <TagContainer tags>{`#${tag.label}`}</TagContainer> : null
  }
}
