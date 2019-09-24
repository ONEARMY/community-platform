import React from 'react'
import theme from 'src/themes/styled.theme'
import { Link, Flex, Image } from 'rebass/styled-components'
import styled from 'styled-components'
import LogoImage from 'src/assets/images/logo.svg'
import LogoBackground from 'src/assets/images/logo-background.svg'
import Text from 'src/components/Text'

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
      left: -50px;
    }
  }
`

export class Header extends React.Component {
  render() {
    return (
      <>
        <LogoContainer>
          <Link
            sx={{ zIndex: 9999, display: 'flex', alignItems: 'center' }}
            color="black"
            ml={[2, 3, 4]}
            href="/"
          >
            <Flex
              sx={{
                width: ['35px', '45px', '45px'],
                height: ['35px', '45px', '45px'],
              }}
            >
              <Image src={LogoImage} />
            </Flex>
            <Text ml={2}>Precious Plastic</Text>
          </Link>
        </LogoContainer>
      </>
    )
  }
}

export default Header
