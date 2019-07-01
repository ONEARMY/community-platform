import React from 'react'
import withBreadcrumbs from 'react-router-breadcrumbs-hoc'
import HowtoBreadcrumb from './HowtoBreadcrumb'
import DiscussionsBreadcrumb from './DiscussionsBreadcrumb'

const routes = [
  { path: '/how-to', breadcrumb: 'How-to' },
  { path: '/how-to/create', breadcrumb: 'Create' },
  { path: '/how-to/:slug', breadcrumb: HowtoBreadcrumb },
  { path: '/discussions', breadcrumb: 'Discussions' },
  { path: '/discussions/create', breadcrumb: 'Create' },
  { path: '/discussions/:slug', breadcrumb: DiscussionsBreadcrumb },
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
