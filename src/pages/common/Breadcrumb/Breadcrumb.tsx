import withBreadcrumbs from 'react-router-breadcrumbs-hoc'
import { Link } from 'react-router-dom'
import HowtoBreadcrumb from 'src/pages/common/Breadcrumb/HowtoBreadcrumb'
import { Text } from 'theme-ui'
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
          <Link to={match.url}>
            <Text color="black">{breadcrumb}</Text>
          </Link>
        ) : (
          <> {breadcrumb} </>
        )}
      </span>
    ))}
  </div>
)

export default withBreadcrumbs(routes, { disableDefaults: true })(Breadcrumbs)
