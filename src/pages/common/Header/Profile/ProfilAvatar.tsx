import styled from 'styled-components'
import theme from 'src/themes/styled.preciousplastic'
import { Box } from 'rebass'

const ProfileAvatar = styled(Box)`
  display: block;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: ${theme.colors.background};
`

export default ProfileAvatar
