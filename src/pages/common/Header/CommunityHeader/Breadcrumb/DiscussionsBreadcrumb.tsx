import React from 'react'
import { inject, observer } from 'mobx-react'

@inject('discussionsStore')
@observer
export default class DiscussionsBreadcrumb extends React.Component<any> {
  render() {
    return this.props.discussionsStore!.activeDiscussion
      ? this.props.discussionsStore.activeDiscussion.title
      : null
  }
}
