import { Component } from 'react';
import { inject, observer } from 'mobx-react'

@inject('howtoStore')
@observer
export default class HowtoBreadcrumb extends Component<any> {
  render() {
    return this.props.howtoStore!.activeHowto
      ? this.props.howtoStore.activeHowto.title
      : null
  }
}
