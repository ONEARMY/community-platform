import { Box } from 'rebass'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { MODULE } from 'src/modules'
import theme from 'src/themes/styled.theme'
import { ADMIN_PAGES } from '../admin.routes'

const moduleName = MODULE.ADMIN

const SubmenuLink = styled(NavLink).attrs(() => ({
  activeClassName: 'active',
}))`
  padding: 0px ${props => props.theme.space[4]}px;
  color: ${theme.colors.white};
  &:hover {
  }
  &.active {
    color: ${theme.colors.yellow.base};
    text-decoration: underline;
  }
`

const AdminSubheader = () => (
  <Box bg={theme.colors.black} p={2} textAlign={'right'}>
    {ADMIN_PAGES.map(p => (
      <SubmenuLink key={p.path} to={`/${moduleName}${p.path}`} exact>
        {p.title}
      </SubmenuLink>
    ))}
  </Box>
)

export default AdminSubheader
