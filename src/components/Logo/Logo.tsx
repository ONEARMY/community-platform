import React from 'react'
import theme from 'src/themes/styled.theme'
import { Link, Flex, Image } from 'rebass'
import styled from 'styled-components'
import LogoImage from 'src/assets/images/logo.svg'
import LogoBackground from 'src/assets/images/logo-background.svg'

const LogoContainer = styled(Flex)`
  height: 60px;
  width: 200px;
  align-items: center;
  position: relative;
  &:before {
    content: '';
    position: absolute;
    background-image: url(${LogoBackground});
    width: 250px;
    height: 70px;
    z-index: 999;
    background-size: contain;
    background-repeat: no-repeat;
    top: 0;
    left: 0px;
  }
  @media only screen and (max-width: ${theme.breakpoints[1]}) {
    &:before {
      left: -20px;
    }
  }
`

const LogoLink = styled(Link)`
  z-index: 9999;
  display: flex;
  align-items: center;
  color: black;
`

const LogoImageContainer = styled(Flex)`
  width: 45px;
  height: 45px;
`

const LogoTitle = styled.h1`
  font-size: 17px;
  font-weight: 400;
  margin: 0px 0px 0px 15px;
  width: 130px;
`

export class Header extends React.Component {
  render() {
    return (
      <>
        <LogoContainer>
          <LogoLink ml={[2, 3, 4]} href="/">
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
