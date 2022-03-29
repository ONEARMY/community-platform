import styled from '@emotion/styled'
import theme from 'src/themes/styled.theme'
import ProfileLink from './ProfileLink'

const UserContactInfo = styled.div`
  h6 {
    margin-top: ${theme.space[3]}px;
  }
  div {
    margin-bottom: ${theme.space[2]}px;
    margin-top: ${theme.space[3]}px;

    &:last-child {
      margin-bottom: 0;
    }
  }
`

export const UserContactAndLinks = ({ links }) =>
  !!links.length ? (
    <UserContactInfo>
      <span>Contact & Links</span>
      {links.map((link, i) => (
        <ProfileLink link={link} key={'Link-' + i} />
      ))}
    </UserContactInfo>
  ) : null

export default UserContactAndLinks
