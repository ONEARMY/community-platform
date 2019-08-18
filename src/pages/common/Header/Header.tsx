import React from 'react'
import { Flex } from 'rebass'
import styled from 'styled-components'
import theme from 'src/themes/styled.preciousplastic'
import Profile from 'src/pages/common/Header/Profile/Profile'
import MenuDesktop from 'src/components/Menu/MenuDesktop'
import Logo from 'src/components/Logo/Logo'

const FlexHeader = styled(Flex)`
  ${theme.header.container.style}
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
            <Profile />
          </Flex>
        </FlexHeader>
      </>
    )
  }
}

export default Header
