import { Component } from 'react'
// TODO: Remove direct usage of Theme
import { preciousPlasticTheme } from 'oa-themes'
const theme = preciousPlasticTheme.styles
import { Flex, Image, Text } from 'theme-ui'
import styled from '@emotion/styled'
import { inject, observer } from 'mobx-react'
import type { ThemeStore } from 'src/stores/Theme/theme.store'

import { VERSION } from 'src/config/config'
import { Link } from 'react-router-dom'

interface IProps {
  isMobile?: boolean
}

const LogoContainer = styled(Flex)`
  align-items: center;
  position: relative;
  padding: 10px 0;

  @media only screen and (min-width: ${theme.breakpoints[1]}) {
    margin-bottom: -50px;
    padding: 0;
  }
`

interface InjectedProps {
  themeStore: ThemeStore
}

@inject('themeStore')
@observer
export class Logo extends Component<IProps> {
  // eslint-disable-next-line
  constructor(props: any) {
    super(props)
  }

  get injected() {
    return this.props as InjectedProps
  }

  render() {
    const name = this.injected.themeStore?.currentTheme.siteName
    const logo = this.injected.themeStore?.currentTheme.logo
    const nameAndVersion = `${name} logo ${VERSION}`

    return (
      <>
        <LogoContainer>
          <Link to="/">
            <Flex
              ml={[0, 4]}
              sx={{
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                width: ['50px', '50px', '100px'],
                height: ['50px', '50px', '100px'],
              }}
            >
              <Image
                loading="lazy"
                src={logo}
                sx={{
                  width: [50, 50, 100],
                  height: [50, 50, 100],
                }}
                alt={nameAndVersion}
                title={nameAndVersion}
              />
            </Flex>
            <Text
              className="sr-only"
              ml={2}
              sx={{ display: ['none', 'none', 'block'] }}
              color="black"
            >
              Precious Plastic
            </Text>
          </Link>
        </LogoContainer>
      </>
    )
  }
}

export default Logo
