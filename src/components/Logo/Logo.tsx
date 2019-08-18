import React from 'react'
import theme from 'src/themes/styled.preciousplastic'
import { Link, Flex, Image } from 'rebass'
import styled from 'styled-components'
import LogoImage from 'src/assets/images/logo.svg'

const LogoContainer = styled(Flex)`
  ${theme.header.logo.container.style}
`

const LogoLink = styled(Link)`
  ${theme.header.logo.link.style}
`

const LogoImageContainer = styled(Flex)`
  ${theme.header.logo.image.style}
`

const LogoTitle = styled.h1`
  ${theme.header.logo.title.style}
`

export class Header extends React.Component {
  render() {
    return (
      <>
        <LogoContainer>
          <LogoLink href="/">
            <LogoImageContainer>
              <Image src={LogoImage} />
            </LogoImageContainer>
            <LogoTitle>Precious Plastic</LogoTitle>
          </LogoLink>
        </LogoContainer>
      </>
    )
  }
}

export default Header
