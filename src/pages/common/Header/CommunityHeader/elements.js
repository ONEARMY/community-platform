import styled, { css } from 'styled-components'
import Button from '@material-ui/core/Button'
import AvatarPic from '@material-ui/core/Avatar'
import { NavLink } from 'react-router-dom'

const navButtonStyle = css`
  margin-right: 2em;
  text-decoration: none;
  color: black;
`

const activeClassName = 'link-active'

export const Content = styled.div`
  display: flex;
  height: 6em;
  align-items: center;
  padding: 10px;
  background-color: white;
  color: black;
`

export const LogoText = styled.div`
  font-size: xx-large;
`

export const Logo = styled.img`
  height: 4em;
  width: 4em;
  object-fit: cover;
  position: relative;
`
export const Links = styled.div`
  margin-left: 5em;
  flex: 1;
`

export const Profile = styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;
`

export const ListButton = styled(Button)`
  ${navButtonStyle}
`

export const LinkButton = styled(NavLink).attrs(({ name }) => ({
  activeClassName: name || activeClassName,
}))`
    ${navButtonStyle}
    &.${activeClassName} {
        text-decoration: underline;
    }  
`

export const Avatar = styled(AvatarPic)`
  cursor: pointer;
`

export const SectionDescription = styled.div`
  background-color: #2d5786;
  display: block;
  color: white;
  padding: 10px;
  text-align: center;
`
