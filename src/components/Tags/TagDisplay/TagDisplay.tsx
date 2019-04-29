import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { TagsStore } from 'src/stores/Tags/tags.store'
import { ITag } from 'src/models/tags.model'
import { Box } from 'rebass'
import Text from 'src/components/Text'

import theme from 'src/themes/styled.theme'
import Styled from 'styled-components'

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

const TagContainer = Styled(Box)`
  border-radius: ${theme.radii[1] + 'px'};
  display: inline-block;
`

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
      <TagContainer bg={'greyTag'} p={2} ml={'5px'} mt={'5px'}>
        <Text small>{tag.label}</Text>
      </TagContainer>
    ) : null
  }
}
