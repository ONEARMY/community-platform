import { Link } from 'src/components/Links'
import withBreadcrumbs from 'react-router-breadcrumbs-hoc'
import HowtoBreadcrumb from 'src/pages/common/Breadcrumb/HowtoBreadcrumb'
const routes = [
  { path: '/how-to', breadcrumb: 'How-to' },
  { path: '/how-to/create', breadcrumb: 'Create' },
  { path: '/how-to/:slug', breadcrumb: HowtoBreadcrumb },
  { path: '/events', breadcrumb: 'Events' },
  { path: '/events/create', breadcrumb: 'Create' },
  { path: '/map', breadcrumb: 'Welcome to the Map' },
]

const Breadcrumbs = ({ breadcrumbs }) => (
  <div>
    {breadcrumbs.map(({ match, breadcrumb }, index) => (
      <span key={match.url}>
        {index > 0 ? ' > ' : null}
        {index < breadcrumbs.length - 1 ? (
          <Link to={match.url} color={'black'}>
            {breadcrumb}
          </Link>
        ) : (
          <> {breadcrumb} </>
        )}
      </span>
    ))}
  </div>
)

export default withBreadcrumbs(routes, { disableDefaults: true })(Breadcrumbs)
