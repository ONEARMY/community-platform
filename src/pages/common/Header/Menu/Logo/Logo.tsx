import { Component } from 'react'
import { Link, Flex, Image } from 'rebass/styled-components'
import styled from 'styled-components'

import Text from 'src/components/Text'
import { VERSION } from 'src/config/config'
import { inject, observer } from 'mobx-react'
import type { ThemeStore } from 'src/stores/Theme/theme.store'

interface IProps {
  isMobile?: boolean
  themeStore?: ThemeStore
}

const LogoContainer = styled(Flex)`
  align-items: center;
  position: relative;
  padding: 10px 0;

  @media only screen and (min-width: ${props => props.theme.breakpoints[1]}) {
    margin-bottom: -50px;
    padding: 0;
  }
`
@inject('themeStore')
@observer
export class Logo extends Component<IProps> {
  // eslint-disable-next-line
  constructor(props: any) {
    super(props)
  }
  render() {
    const name = this.props.themeStore.currentTheme.siteName
    const nameAndVersion = `${name} logo v${VERSION}`
    return (
      <>
        <LogoContainer>
          <Link
            sx={{ zIndex: 1000, display: 'flex', alignItems: 'center' }}
            color="black"
            ml={[0, 4]}
            href="/"
          >
            <Flex
              sx={{
                width: ['50px', '50px', '100px'],
                height: ['50px', '50px', '100px'],
              }}
            >
              <Image
                src={this.props.themeStore.currentTheme.logo}
                width={[50, 50, 100]}
                height={[50, 50, 100]}
                alt={nameAndVersion}
                title={nameAndVersion}
              />
            </Flex>
            <Text
              className="sr-only"
              ml={2}
              display={['none', 'none', 'block']}
            >
              {name}
            </Text>
          </Link>
        </LogoContainer>
      </>
    )
  }
}

export default Logo
