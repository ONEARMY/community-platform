import styled from '@emotion/styled'
import Linkify from 'react-linkify'
import theme from 'src/themes/styled.theme'

const StyledLinkify = styled(Linkify)`
  a {
    color: ${theme.colors.grey};
    text-decoration: underline;
  }

  a:hover {
    text-decoration: none;
  }
`

export default StyledLinkify
