import React from 'react'
import withBreadcrumbs from 'react-router-breadcrumbs-hoc'
import { inject, observer } from 'mobx-react'

@inject('howtoStore')
@observer
class HowtoBreadcrumb extends React.Component<any> {
  render() {
    return this.props.howtoStore!.activeHowto
      ? this.props.howtoStore.activeHowto.title
      : null
  }
}

const routes = [
  { path: '/how-to', breadcrumb: 'How-to' },
  { path: '/how-to/create', breadcrumb: 'Create' },
  { path: '/how-to/:slug', breadcrumb: HowtoBreadcrumb },
]

const Breadcrumbs = ({ breadcrumbs }) => (
  <div>
    {breadcrumbs.map(({ match, breadcrumb }, index) => (
      <span key={match.url}>
        {index > 0 ? ' > ' : null}
        {breadcrumb}
      </span>
    ))}
  </div>
)

export default withBreadcrumbs(routes, { disableDefaults: true })(Breadcrumbs)
