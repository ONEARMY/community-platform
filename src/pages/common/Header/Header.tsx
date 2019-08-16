import React from 'react'
import { Flex } from 'rebass'
import styled from 'styled-components'
import Profile from 'src/pages/common/Header/Profile/Profile'
import MenuDesktop from 'src/pages/common/Header/Menu/MenuDesktop'
import MenuMobile from 'src/pages/common/Header/Menu/MenuMobile'
import Logo from 'src/pages/common/Header/Logo/Logo'

const FlexHeader = styled(Flex)`
  height: 60px;
  background-color: white;
  justify-content: space-between;
  align-items: center;
`

export class Header extends React.Component {
  render() {
    return (
      <>
        <FlexHeader>
          <Flex>
            <Logo />
          </Flex>
          <Flex>
            <MenuDesktop />
            <MenuMobile />
            <Profile />
          </Flex>
        </FlexHeader>
      </>
    )
  }
}

export default Header
