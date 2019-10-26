import React from 'react'
import { Flex } from 'rebass/styled-components'
import styled from 'styled-components'
import Profile from 'src/pages/common/Header/Menu/Profile/Profile'
import MenuDesktop from 'src/pages/common/Header/Menu/MenuDesktop'
import MenuMobilePanel from 'src/pages/common/Header/Menu/MenuMobile/MenuMobilePanel'
import posed, { PoseGroup } from 'react-pose'
import Logo from 'src/pages/common/Header/Menu/Logo/Logo'
import theme from 'src/themes/styled.theme'
import HamburgerMenu from 'react-hamburger-menu'

interface IState {
  isMobilePanelOpen: boolean
}

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

const AnimationContainer = posed.div({
  enter: {
    duration: 200,
    position: 'relative',
    top: '0',
  },
  exit: {
    duration: 200,
    position: 'relative',
    top: '-100%',
  },
})

export class Header extends React.Component<any, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      isMobilePanelOpen: false,
    }
  }

  toggleMobilePanel() {
    this.setState({ isMobilePanelOpen: !this.state.isMobilePanelOpen })
  }

  render() {
    return (
      <>
        <Flex
          data-cy="header"
          bg="white"
          justifyContent="space-between"
          alignItems="center"
          sx={{ zIndex: 1000, position: 'relative' }}
        >
          <Flex>
            <Logo />
          </Flex>
          <DesktopMenuWrapper className="menu-desktop" px={2}>
            <MenuDesktop />
            <Profile isMobile={false} />
          </DesktopMenuWrapper>
          <MobileMenuWrapper className="menu-mobile">
            <Flex px={5}>
              <HamburgerMenu
                isOpen={this.state.isMobilePanelOpen}
                menuClicked={() => this.toggleMobilePanel()}
                width={18}
                height={15}
                strokeWidth={1}
                rotate={0}
                color="black"
                borderRadius={0}
                animationDuration={0.3}
              />
            </Flex>
          </MobileMenuWrapper>
        </Flex>
        <PoseGroup>
          {this.state.isMobilePanelOpen && (
            <AnimationContainer key={'mobilePanelContainer'}>
              <MobileMenuWrapper>
                <MenuMobilePanel />
              </MobileMenuWrapper>
            </AnimationContainer>
          )}
        </PoseGroup>
      </>
    )
  }
}

export default Header
