import { Box } from 'theme-ui'
import { NavLink } from 'react-router-dom'
import styled from '@emotion/styled'
import { MODULE } from 'src/modules'
import theme from 'src/themes/styled.theme'
import { ADMIN_PAGES } from '../admin.routes'

const moduleName = MODULE.ADMIN

const SubmenuLink = styled(NavLink)`
  font-family: 'Inter', helveticaNeue, Arial, sans-serif;
  padding: 0px ${props => props.theme.space[4]}px;
  color: ${theme.colors.white};
  &:hover {
  }
  &.active {
    color: ${theme.colors.yellow.base};
    text-decoration: underline;
  }
`

SubmenuLink.defaultProps = {
  activeClassName: 'active',
}

// The parent container limits max width (at 1280px). Use custom query
// to retain full width beyond this limit
const fullWidthMarginOverride = `calc((${theme.maxContainerWidth /
  2}px - 50vw) - ${theme.space[4]}px  )`

const SubheaderContainer = styled(Box)`
  @media only screen and (min-width: ${theme.maxContainerWidth}px) {
    margin-left: ${fullWidthMarginOverride}!important;
    margin-right ${fullWidthMarginOverride}!important;
  }
`

const AdminSubheader = () => (
  <SubheaderContainer
    bg={theme.colors.black}
    p={2}
    sx={{textAlign:'right'}}
    ml={[-2, -3, -4]} // adjust for main-container padding on regular screen breakpoints
    mr={[-2, -3, -4]}
    data-cy="admin-subheader"
  >
    {ADMIN_PAGES.map(p => (
      <SubmenuLink key={p.path} to={`/${moduleName}${p.path}`} exact>
        {p.title}
      </SubmenuLink>
    ))}
  </SubheaderContainer>
)

export default AdminSubheader
