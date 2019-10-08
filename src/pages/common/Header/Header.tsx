import React from 'react'
import { Flex } from 'rebass/styled-components'
import styled from 'styled-components'
import Profile from 'src/pages/common/Header/Profile/Profile'
import MenuDesktop from 'src/pages/common/Header/Menu/MenuDesktop'
import MenuMobile from 'src/pages/common/Header/Menu/MenuMobile'
import Logo from 'src/pages/common/Header/Menu/Logo/Logo'
import theme from 'src/themes/styled.theme'

const MobileMenuWrapper = styled(Flex)`
  position: relative;

  @media only screen and (max-width: ${theme.breakpoints[1]}) {
    display: flex;
  }

  @media only screen and (min-width: ${theme.breakpoints[1]}) {
    display: none;
  }
`
const DesktopMenuWrapper = styled(Flex)`
  position: relative;

  @media only screen and (max-width: ${theme.breakpoints[1]}) {
    display: none;
  }

  @media only screen and (min-width: ${theme.breakpoints[1]}) {
    display: flex;
  }
`

export class Header extends React.Component {
  render() {
    return (
      <>
        <Flex bg="white" justifyContent="space-between" alignItems="center">
          <Flex>
            <Logo />
          </Flex>
          <DesktopMenuWrapper className="menu-desktop" px={2}>
            <MenuDesktop />
            <Profile />
          </DesktopMenuWrapper>
          <MobileMenuWrapper className="menu-mobile">
            <MenuMobile />
          </MobileMenuWrapper>
        </Flex>
      </>
    )
  }
}

export default Header
