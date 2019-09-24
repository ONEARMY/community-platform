import React from 'react'
import { Flex } from 'rebass'
import Profile from 'src/pages/common/Header/Profile/Profile'
import MenuDesktop from 'src/pages/common/Header/Menu/MenuDesktop'
import MenuMobile from 'src/pages/common/Header/Menu/MenuMobile'
import Logo from 'src/components/Logo/Logo'

export class Header extends React.Component {
  render() {
    return (
      <>
        <Flex
          sx={{ height: '60px' }}
          bg="white"
          justifyContent="space-between"
          alignItems="center"
        >
          <Flex>
            <Logo />
          </Flex>
          <Flex mr={[2, 3, 4]}>
            <MenuDesktop />
            <MenuMobile />
            <Profile />
          </Flex>
        </Flex>
      </>
    )
  }
}

export default Header
