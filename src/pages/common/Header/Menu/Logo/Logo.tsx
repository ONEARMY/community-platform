import React from 'react'
import theme from 'src/themes/styled.theme'
import { Link, Flex, Image } from 'rebass/styled-components'
import styled from 'styled-components'
import LogoImage from 'src/assets/images/logo.svg'
import MobileLogoImage from 'src/assets/images/logo-mobile.svg'
import LogoBackground from 'src/assets/images/logo-background.svg'
import Text from 'src/components/Text'
import { zIndex } from 'src/themes/styled.theme'

interface IProps {
  isMobile?: boolean
}

const LogoContainer = styled(Flex)`
  height: 60px;
  width: 200px;
  align-items: center;
  position: relative;
`

export class Logo extends React.Component<IProps> {
  constructor(props: any) {
    super(props)
  }
  render() {
    return (
      <>
        <LogoContainer>
          <Link
            sx={{ zIndex: 1000, display: 'flex', alignItems: 'center' }}
            color="black"
            ml={[2, 3, 4]}
            href="/"
          >
            <Flex
              sx={{
                width: ['50px', '50px', '45px'],
                height: ['50px', '50px', '45px'],
              }}
            >
              <Image
                src={this.props.isMobile ? MobileLogoImage : LogoImage}
                width={50}
                height={50}
              />
            </Flex>
            <Text ml={2} display={['none', 'none', 'block']}>
              Precious Plastic
            </Text>
          </Link>
        </LogoContainer>
      </>
    )
  }
}

export default Logo
