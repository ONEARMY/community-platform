import { Box, NavLink } from 'theme-ui'
import { MODULE } from 'src/modules'
import { ADMIN_PAGES } from '../admin.routes'
import { Fragment } from 'react'

const moduleName = MODULE.ADMIN

const AdminSubheader = () => (
  <Box bg={'black'} p={2} sx={{ textAlign: 'right' }} data-cy="admin-subheader">
    {ADMIN_PAGES.map((page) => {
      return page.disabled ? (
        <Fragment key={page.path}>
          <NavLink
            href={`/${moduleName}${page.path}`}
            className="disabled"
            data-tip={'Coming soon...'}
            onClick={(e) => {
              e.preventDefault()
            }}
            sx={{ color: 'white', opacity: 0.5, px: 1 }}
          >
            {page.title}
          </NavLink>
        </Fragment>
      ) : (
        <NavLink
          key={page.path}
          href={`/${moduleName}${page.path}`}
          sx={{ color: 'white', px: 1 }}
        >
          {page.title}
        </NavLink>
      )
    })}
  </Box>
)

export default AdminSubheader
