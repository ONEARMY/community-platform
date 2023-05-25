/** @jsxImportSource theme-ui */
import { Box } from 'theme-ui'
import { NavLink as ReactRouterNavLink } from 'react-router-dom'
import { MODULE } from 'src/modules'
import { ADMIN_PAGES } from '../admin.routes'
import { Fragment } from 'react'
import { Tooltip } from 'oa-components'

const moduleName = MODULE.ADMIN

const AdminSubheader = () => (
  <Box bg={'black'} p={2} sx={{ textAlign: 'right' }} data-cy="admin-subheader">
    {ADMIN_PAGES.map((page) => {
      return page.disabled ? (
        <Fragment key={page.path}>
          <ReactRouterNavLink
            to={`/${moduleName}${page.path}`}
            className="disabled"
            data-tip={'Coming soon...'}
            onClick={(e) => {
              e.preventDefault()
            }}
            sx={{ color: 'white', opacity: 0.5, px: 1 }}
          >
            {page.title}
          </ReactRouterNavLink>
        </Fragment>
      ) : (
        <ReactRouterNavLink
          key={page.path}
          to={`/${moduleName}${page.path}`}
          sx={{ color: 'white', px: 1 }}
        >
          {page.title}
        </ReactRouterNavLink>
      )
    })}
    <Tooltip />
  </Box>
)

export default AdminSubheader
