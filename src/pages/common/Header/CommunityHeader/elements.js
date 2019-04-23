import styled, { css } from 'styled-components'
import { NavLink } from 'react-router-dom'

const navButtonStyle = css`
  margin-right: 2em;
  text-decoration: none;
  color: black;
`

const activeClassName = 'link-active'

export const Content = styled.div`
  display: flex;
  height: 40px;
  align-items: center;
  padding: 10px;
  background-color: white;
  color: black;
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

export const LinkButton = styled(NavLink).attrs(({ name }) => ({
  activeClassName: name || activeClassName,
}))`
    ${navButtonStyle}
    &.${activeClassName} {
        text-decoration: underline;
    }
`
